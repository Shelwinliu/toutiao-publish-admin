// FormData 发送图片
export function formDataReq(key, value) {
  const formData = new FormData();
  formData.append(key, value);
  return formData
}