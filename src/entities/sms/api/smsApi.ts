import { api } from "@/shared/api/base/client";

export const smsApi = {
  // send
  sendSms: (data: { customer_ids: number[]; text: string }) =>
    api.post("/sms/send-sms/", data),

  // send by id
  sendSmsByTemplate: (data: { id: number; customer_ids: number[] }) =>
    api.post(`/sms/send-sms/${data.id}/`, {
      customer_ids: data.customer_ids,
    }),

  // create
  createSmsTemplate: (data: { name: string; content: string }) =>
    api.post("/sms/", data),

  // get
  getSmsTemplate: () => api.get(`/sms/`),

  // get by id
  getSmsTemplateById: (id?: number) => api.get(`/sms/${id}/`),
};
