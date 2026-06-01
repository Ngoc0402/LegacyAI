export async function enhancePhotoWithAI(imageUrl) {
  const imageResponse = await fetch(imageUrl)
  const imageBlob = await imageResponse.blob()

  const file = new File([imageBlob], 'legacy-photo.jpg', {
    type: imageBlob.type || 'image/jpeg',
  })

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('http://127.0.0.1:8000/enhance-photo/', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Enhance photo failed')
  }

  const enhancedBlob = await response.blob()
  return URL.createObjectURL(enhancedBlob)
}