import { APIS } from ".."
import { IResponse } from "../../shared/models/response"
import { ApiConfig, useCustomMutation } from "../request"

export const useCreateConversation = () => {
    return useCustomMutation<IResponse<any>, any>(
      APIS.CONVERSATIONS.CREATE_CONVERSATION,
      "POST",
      ApiConfig.STRUCTER
    );
};

export const useCreateMessage = () => {
    return useCustomMutation<IResponse<any>, any>(
      APIS.CONVERSATIONS.CREATE_MESSAGE,
      "POST",
      ApiConfig.AGENTIC
    );
};

export const useCreateMessageStream = () => {
    return useCustomMutation<IResponse<any>, any>(
      APIS.CONVERSATIONS.CREATE_MESSAGE_STREAM,
      "POST",
      ApiConfig.AGENTIC,
      true
    );
};
  
  