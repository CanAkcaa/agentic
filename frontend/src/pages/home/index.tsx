import { Button, message, Avatar, Badge, Modal, Tag, Switch } from "antd";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { App, Space, Spin, Typography } from 'antd';
import { Sender } from '@ant-design/x';
import { OpenAIOutlined, UserOutlined, RobotOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useCreateConversation, useCreateMessage, useCreateMessageStream } from "../../api/services/conversations";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  badges?: any[];
}

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const createConversationMutation = useCreateConversation();
  const createMessageMutation = useCreateMessage();
  const createMessageStreamMutation = useCreateMessageStream();
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const senderRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadgeData, setSelectedBadgeData] = useState<any>(null);
  const [isStream, setIsStream] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateConversation = async () => {
    try {
      const result = await createConversationMutation.mutateAsync({
        body: {
          memory: {},
          memory_type: "CHECKPOINTER",
          user_information: {
            customer_guid: "123"
          }
        },
      });
      if (result.success) {
        setConversationId(result.data?._id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCreateConversation();
  }, []);

  const handleCreateMessage = async (messageText: string) => {
    try {
      const userMessage: Message = {
        type: 'user',
        content: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      const thinkingMessage: Message = {
        type: 'ai',
        content: 'düşünüyor...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thinkingMessage]);
      setLoading(true);

      const result = await createMessageMutation.mutateAsync({
        body: {
          conversation_id: conversationId,
          user_text: messageText,
        },
      });

      if (result.success && result.data?.messages) {
        const allMessages = result.data.messages;
        
        let lastHumanIndex = -1;
        for (let i = allMessages.length - 1; i >= 0; i--) {
          if (allMessages[i].type === 'human') {
            lastHumanIndex = i;
            break;
          }
        }

        const lastMessage = allMessages[allMessages.length - 1];
        
        const badgeMessages = lastHumanIndex !== -1 
          ? allMessages.slice(lastHumanIndex + 1, allMessages.length - 1)
          : [];

        let aiContent = lastMessage.content;
        if (aiContent.startsWith('llmResponse: ')) {
          aiContent = aiContent.replace('llmResponse: ', '');
        }

        const aiMessage: Message = {
          type: 'ai',
          content: aiContent,
          timestamp: new Date(),
          badges: badgeMessages,
        };

        setMessages(prev => {
          const updated = [...prev];
          updated.pop();
          updated.push(aiMessage);
          return updated;
        });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      messageApi.error('Mesaj gönderilemedi!');
      setMessages(prev => prev.slice(0, -1));
      setLoading(false);
    }
  };

  const handleCreateMessageStream = async (messageText: string) => {
    try {
      const userMessage: Message = {
        type: 'user',
        content: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
  
      const streamingMessage: Message = {
        type: 'ai',
        content: '',
        timestamp: new Date(),
        badges: undefined
      };
      setMessages(prev => [...prev, streamingMessage]);
      setLoading(true);
  
      const result = await createMessageStreamMutation.mutateAsync({
        body: {
          conversation_id: conversationId,
          user_text: messageText,
        },
      });
  
      const reader = result.data?.reader;
      const decoder = new TextDecoder();
  
      if (!reader) {
        throw new Error('Stream reader bulunamadı');
      }
  
      let streamedContent = '';
      let isDone = false;
  
      while (!isDone) {
        const { done, value } = await reader.read();
        
        if (done) {
          isDone = true;
          break;
        }
  
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (let line of lines) {
          line = line.replace('data: ', '');
          try {
            const data = JSON.parse(line);
            if (data.done === true) {
              isDone = true;
              setLoading(false);
              break;
            }
            
            if (data.text) {
              let cleanText = data.text;
              
              if (cleanText.startsWith('llmResponse: ')) {
                cleanText = cleanText.replace('llmResponse: ', '');
              }
              
              if (cleanText.trim()) {
                streamedContent = cleanText;
                
                setMessages(prev => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg.type === 'ai') {
                    lastMsg.content = streamedContent;
                  }
                  return [...updated];
                });
              }
            }
            
          } catch (e) {
            console.warn('Parse error:', e, 'Line:', line);
          }
        }
      }
  
      setLoading(false);
      
    } catch (error) {
      console.error('Stream error:', error);
      messageApi.error('Mesaj gönderilemedi!');
      setMessages(prev => prev.slice(0, -2));
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (isStream) {
      await handleCreateMessageStream(messageText);
    } else {
      await handleCreateMessage(messageText);
    }
  };

  const handleButtonClick = (buttonText: string, focusAction: () => void) => {
    focusAction();
    handleSendMessage(buttonText);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBadgeClick = (badgeData: any) => {
    setSelectedBadgeData(badgeData);
    setModalVisible(true);
  };

  const ThinkingDots = () => (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
      </div>
      <span className="text-sm text-gray-500 font-light">Yazıyor...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {contextHolder}

      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <RobotOutlined className="text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Asistan</h1>
              <p className="text-blue-100 text-sm font-light">Size nasıl yardımcı olabilirim?</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className={`w-2 h-2 rounded-full ${isStream ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isStream ? 'Canlı Yanıt' : 'Standart Mod'}
              </span>
            </div>
            <Switch 
              checked={isStream} 
              onChange={setIsStream}
              size="small"
              className="bg-white/20"
            />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <img 
                    src="https://play-lh.googleusercontent.com/i_8y7fBNjFds0fYb5VDVybgzBI9TC4-54lbd2Mh2kTnm0eTqnVMj_ws2vbP5SAnXw7o" 
                    alt="AI Avatar" 
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-700 mb-2">Merhaba! 👋</h3>
              <p className="text-gray-500 font-light mb-8">Sormak istediğiniz bir şey var mı?</p>
              
              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                <div 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
                  onClick={() => handleButtonClick('Siparişim ne durumda?', () => senderRef.current?.focus())}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                    <span className="text-blue-600 text-sm">📦</span>
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm">Sipariş Durumu</h4>
                  <p className="text-gray-500 text-xs mt-1">Siparişinizin mevcut durumu</p>
                </div>
                
                <div 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-purple-200"
                  onClick={() => handleButtonClick('Gift kartımı nasıl kullanabilirim?', () => senderRef.current?.focus())}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                    <span className="text-purple-600 text-sm">🎁</span>
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm">Gift Kart</h4>
                  <p className="text-gray-500 text-xs mt-1">Gift kart kullanım rehberi</p>
                </div>
                
                <div 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-green-200"
                  onClick={() => handleButtonClick('Aktif kampanyalar neler?', () => senderRef.current?.focus())}
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                    <span className="text-green-600 text-sm">🔥</span>
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm">Kampanyalar</h4>
                  <p className="text-gray-500 text-xs mt-1">Aktif kampanya bilgileri</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.type === 'ai' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}>
                  {msg.type === 'ai' ? (
                    <img 
                      src="https://play-lh.googleusercontent.com/i_8y7fBNjFds0fYb5VDVybgzBI9TC4-54lbd2Mh2kTnm0eTqnVMj_ws2vbP5SAnXw7o" 
                      alt="AI Avatar" 
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                  ) : (
                    <img 
                      src="https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg" 
                      alt="User Avatar" 
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 min-w-0 max-w-[70%] ${msg.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div className={`flex items-center gap-2 mb-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-semibold text-gray-700">
                      {msg.type === 'ai' ? 'AI Asistan' : 'Siz'}
                    </span>
                    <span className="text-xs text-gray-400 font-light">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  
                  <div className={`relative rounded-3xl px-5 py-3 shadow-sm ${
                    msg.type === 'ai'
                      ? 'bg-[#f0f0f0] text-gray-800'
                      : 'bg-[#F25451] text-gray-900 max-w-[80%]'
                  }`}>
                    {msg.content === 'düşünüyor...' ? (
                      <ThinkingDots />
                    ) : (
                      <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap m-0 font-light">
                        {msg.content}
                      </p>
                    )}
                    
                    {/* Thinking indicator for streaming */}
                    {loading && index === messages.length - 1 && msg.type === 'ai' && msg.content !== 'düşünüyor...' && (
                      <div className="mt-3">
                        <ThinkingDots />
                      </div>
                    )}
                  </div>
                  
                  {/* Badges */}
                  {msg.badges && msg.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.badges.map((badge, badgeIndex) => (
                        <div key={badgeIndex} className="flex items-center gap-2">
                          <div
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl px-3 py-1.5 cursor-pointer hover:shadow-md transition-all group"
                            onClick={() => handleBadgeClick(badge)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-2 py-0.5">
                                {badge?.type}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">
                                {badge?.name}
                              </span>
                              <RightCircleOutlined className="text-blue-400 text-xs group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/60 bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Action Buttons */}
          
          <Sender
            ref={senderRef}
            value={value}
            className="mt-2"
            loading={loading}
            onChange={setValue}
            disabled={loading}
            placeholder={loading ? 'AI yanıt veriyor, lütfen bekleyin...' : 'Mesajınızı yazın...'}  
            onSubmit={() => {
              if (!value.trim()) return;
              setLoading(true);
              handleSendMessage(value);
              setValue('');
            }}
            onCancel={() => {
              setLoading(false);
            }}
            actions={(_, info) => {
              const { SendButton, LoadingButton, ClearButton, SpeechButton } = info.components;

              return (
                <Space size="small">
                  <ClearButton 
                    disabled={!value.trim()} 
                    className="text-gray-400 hover:text-gray-600"
                  />
                  <SpeechButton className="text-gray-400 hover:text-gray-600" />
                  {loading ? (
                    <LoadingButton 
                      type="default" 
                      icon={<Spin size="small" />} 
                      disabled 
                      className="bg-gray-100"
                    />
                  ) : (
                    <SendButton 
                      type="primary" 
                      icon={<OpenAIOutlined />} 
                      disabled={!value.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:shadow-lg transition-all"
                    />
                  )}
                </Space>
              );
            }}
          />
        </div>
      </div>

      {/* Modal for Badge Details */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span>AI İşlem Detayı</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setModalVisible(false)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none"
          >
            Tamam
          </Button>
        ]}
        width={700}
        className="rounded-2xl"
      >
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200">
          <pre className="text-xs bg-white/50 p-4 rounded-lg overflow-auto max-h-96 font-mono">
            {JSON.stringify(selectedBadgeData, null, 2)}
          </pre>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;