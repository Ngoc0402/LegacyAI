import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Upload,
  Download,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Palette,
  Focus,
} from 'lucide-react'

const MODES = [
  {
    id: 'restore',
    title: 'Restore Old Photo',
    desc: 'Làm rõ ảnh cũ, giảm mờ và phục hồi chi tiết.',
    Icon: Wand2,
  },
  {
    id: 'colorize',
    title: 'Colorize B&W',
    desc: 'Mô phỏng màu sắc cho ảnh đen trắng.',
    Icon: Palette,
  },
  {
    id: 'sharpen',
    title: 'Sharpen Blur',
    desc: 'Tăng độ nét cho ảnh bị mờ hoặc thiếu chi tiết.',
    Icon: Focus,
  },
]

export default function PhotoRestorePage() {
  const [originalImage, setOriginalImage] = useState('')
  const [enhancedImage, setEnhancedImage] = useState('')
  const [mode, setMode] = useState('restore')
  const [loading, setLoading] = useState(false)

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setOriginalImage(imageUrl)
    setEnhancedImage('')
  }

  function handleEnhance() {
    if (!originalImage) {
      alert('Vui lòng chọn ảnh trước')
      return
    }

    setLoading(true)

    setTimeout(() => {
      setEnhancedImage(originalImage)
      setLoading(false)
    }, 800)
  }

  function handleDownload() {
    if (!enhancedImage) {
      alert('Vui lòng xử lý ảnh trước khi tải')
      return
    }

    const link = document.createElement('a')
    link.href = enhancedImage
    link.download = 'legacyai-restored-photo.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-7 shadow-xl mb-6">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-amber-400/10 rounded-full" />

          <div className="relative z-10">
            <p className="text-brand-200 text-sm font-medium mb-2">
              LegacyAI Heritage Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              🖼️ AI Photo Restore
            </h1>
            <p className="text-brand-100 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
              Khôi phục ảnh gia đình cũ, ảnh mờ hoặc ảnh đen trắng để lưu giữ ký ức cho các thế hệ sau.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {MODES.map(({ id, title, desc, Icon }) => {
            const active = mode === id

            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`card text-left hover:shadow-md transition-all hover:-translate-y-0.5 ${
                  active ? 'ring-2 ring-brand-500 bg-brand-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    active ? 'bg-brand-600 text-white' : 'bg-amber-50 text-brand-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-bold text-brand-900">{title}</h3>
                    <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </section>

        <section className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-brand-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand-500" />
                Upload ảnh cần phục hồi
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Hỗ trợ ảnh JPG, PNG, WEBP từ thiết bị của bạn.
              </p>
            </div>

            <label className="btn-primary cursor-pointer flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-500" />
                Original Photo
              </h2>
              <span className="badge bg-amber-50 text-amber-700">
                Before
              </span>
            </div>

            {originalImage ? (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-80 object-contain bg-brand-50 rounded-2xl border border-amber-100"
              />
            ) : (
              <div className="h-80 rounded-2xl bg-brand-50 border border-dashed border-amber-200 flex flex-col items-center justify-center text-stone-400">
                <Upload className="w-10 h-10 mb-3 text-amber-300" />
                <p className="text-sm font-medium">Chưa có ảnh</p>
                <p className="text-xs mt-1">Bấm “Chọn ảnh” để tải ảnh lên</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                Enhanced Photo
              </h2>
              <span className="badge bg-brand-50 text-brand-700">
                After
              </span>
            </div>

            {enhancedImage ? (
              <img
                src={enhancedImage}
                alt="Enhanced"
                className={`w-full h-80 object-contain bg-brand-50 rounded-2xl border border-amber-100 ${
                  mode === 'restore' ? 'contrast-110 brightness-105' : ''
                } ${
                  mode === 'colorize' ? 'saturate-150 contrast-110 brightness-105' : ''
                } ${
                  mode === 'sharpen' ? 'contrast-125 brightness-110' : ''
                }`}
              />
            ) : (
              <div className="h-80 rounded-2xl bg-brand-50 border border-dashed border-amber-200 flex flex-col items-center justify-center text-stone-400">
                <Sparkles className="w-10 h-10 mb-3 text-amber-300" />
                <p className="text-sm font-medium">Chưa có kết quả</p>
                <p className="text-xs mt-1">Bấm “Enhance Photo” để xử lý</p>
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEnhance}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Đang xử lý...' : 'Enhance Photo'}
            </button>

            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>

          <p className="text-xs text-stone-400 mt-4 text-center">
            Phiên bản hiện tại mô phỏng luồng phục hồi ảnh ở frontend. AI thật sẽ được tích hợp ở bước tiếp theo.
          </p>
        </section>
      </main>
    </div>
  )
}