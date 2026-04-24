import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// 1. 更新数据接口，加入 pdf 和 video
interface Work {
  id?: number;
  name: string;
  student_id: string;
  window_type: string;
  poem: string;
  image_url: string; // 画廊封面图
  pdf_url: string;   // PDF完整作业
  video_url: string; // 漫游视频
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWorks(data);
  };

  useEffect(() => {
    if (page === 'gallery') fetchWorks();
  }, [page]);

  // 生成唯一文件名的工具函数
  const generateFileName = (originalName: string) => {
    const ext = originalName.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  };

  // 2. 更新提交流程，支持多文件上传
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const imageFile = (e.currentTarget.querySelector('input[name="imageFile"]') as HTMLInputElement).files?.[0];
    const pdfFile = (e.currentTarget.querySelector('input[name="pdfFile"]') as HTMLInputElement).files?.[0];
    const videoFile = (e.currentTarget.querySelector('input[name="videoFile"]') as HTMLInputElement).files?.[0];

    if (!imageFile || !pdfFile || !videoFile) {
      alert("请确保封面图、PDF作业和视频都已选择！");
      setIsSubmitting(false);
      return;
    }

    try {
      // 定义一个通用的上传函数
      const uploadFile = async (file: File) => {
        const fileName = generateFileName(file.name);
        const { error } = await supabase.storage.from('works-images').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('works-images').getPublicUrl(fileName);
        return data.publicUrl;
      };

      // 并发上传三个文件，大大节省时间
      const [imageUrl, pdfUrl, videoUrl] = await Promise.all([
        uploadFile(imageFile),
        uploadFile(pdfFile),
        uploadFile(videoFile)
      ]);

      // 将所有链接和文本信息存入数据库
      const { error: dbError } = await supabase.from('works').insert([{
        name: formData.get('name'),
        student_id: formData.get('student_id'),
        window_type: formData.get('window_type'),
        poem: formData.get('poem'),
        image_url: imageUrl,
        pdf_url: pdfUrl,
        video_url: videoUrl
      }]);

      if (dbError) throw new Error('数据保存失败: ' + dbError.message);

      fetchWorks();
      setShowUpload(false);
      alert('作业提交成功！');

    } catch (error: any) {
      console.error(error);
      alert("提交出错：" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (page === 'home') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f5' }}>
        <div style={{ flex: '4.5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <h1 style={{ fontSize: '72px', letterSpacing: '8px' }}>山水图窗</h1>
          <button onClick={() => setPage('gallery')} style={{ marginTop: '30px', padding: '12px 40px', cursor: 'pointer', border: '1px solid #000', backgroundColor: '#fff' }}>点击进入</button>
        </div>
        <div style={{ flex: '5.5' }}><img src="/long-cover.png" alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* 左侧侧边栏 */}
      <div style={{ width: '380px', borderRight: '1px solid #000', padding: '40px 30px', position: 'fixed', height: '100vh', overflowY: 'auto', backgroundColor: '#fff', zIndex: 10 }}>
        <h1 style={{ fontSize: '64px', margin: '0 0 10px 0', fontWeight: 'bold' }}>山水图窗</h1>
        <hr style={{ border: 'none', borderTop: '2px solid #000', marginBottom: '40px' }} />

        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontStyle: 'italic', marginBottom: '20px', fontWeight: 'bold' }}>基本信息</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8', fontSize: '15px' }}>
            <li style={{ marginBottom: '8px' }}>● 《艺术与设计思维专题5：中国传统山水的意象与空间》</li>
            <li style={{ color: '#888', fontSize: '12px', marginBottom: '15px', paddingLeft: '15px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</li>
            <li>● 2026年 春季学期</li>
            <li>● 指导教师：邵星宇</li>
          </ul>
          <hr style={{ border: 'none', borderTop: '1px solid #ccc', marginTop: '30px' }} />
        </section>

        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontStyle: 'italic', marginBottom: '20px', fontWeight: 'bold' }}>课程介绍</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', fontSize: '18px' }}>
            <li>● 选题依据</li>
            <li>● 课程目标</li>
            <li>● 课程安排</li>
          </ul>
          <hr style={{ border: 'none', borderTop: '1px solid #ccc', marginTop: '30px' }} />
        </section>

        <section>
          <h2 style={{ fontSize: '36px', fontStyle: 'italic', marginBottom: '20px', fontWeight: 'bold' }}>成果&展示</h2>
          <p onClick={() => setShowUpload(true)} style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px', marginBottom: '30px' }}>
            ● 作业提交
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #ccc', marginTop: '10px' }} />
          <button onClick={() => setPage('home')} style={{ marginTop: '30px', padding: '8px 20px', cursor: 'pointer', background: '#fff', border: '1px solid #000' }}>返回封面</button>
        </section>
      </div>

      {/* 右侧展示区 */}
      <div style={{ marginLeft: '380px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>共 <strong style={{ fontSize: '32px' }}>{works.length}</strong> 件作品</span>
        </div>

        <div style={{ columnCount: 3, columnGap: '25px', position: 'relative', zIndex: 1 }}>
          {works.map((work) => (
            <div key={work.id} style={{ breakInside: 'avoid', marginBottom: '40px', border: '1px solid #f0f0f0', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              {/* 封面图保持原来的裁剪效果 */}
              <div style={{ 
                width: '100%', 
                aspectRatio: work.window_type === '纵长立轴' ? '1/2.5' : (work.window_type === '扇面' ? '2/1' : '1/1'),
                borderRadius: work.window_type === '圆形团扇' ? '50%' : '0',
                clipPath: work.window_type === '扇面' ? 'ellipse(100% 100% at 50% 100%)' : 'none',
                overflow: 'hidden', backgroundColor: '#f9f9f9', marginBottom: '15px'
              }}>
                <img src={work.image_url} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 5px 0' }}><b>{work.name}</b> <span style={{ color: '#888' }}>{work.student_id}</span></p>
                <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>“{work.poem}”</p>
              </div>

              {/* 3. 新增的 PDF 和 视频 按钮 */}
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <a href={work.pdf_url} target="_blank" rel="noreferrer" style={btnStyle}>📄 查看完整画册 (PDF)</a>
                <a href={work.video_url} target="_blank" rel="noreferrer" style={btnStyle}>▶️ 播放漫游视频</a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 提交弹窗 */}
      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px 40px', width: '450px', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>上传最终作业</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="学生姓名" required style={iS} />
              <input name="student_id" placeholder="学号" required style={iS} />
              
              <select name="window_type" style={iS}>
                <option value="圆形团扇">圆形团扇</option>
                <option value="扇面">扇面</option>
                <option value="横长册页">横长册页</option>
                <option value="纵长立轴">纵长立轴</option>
              </select>
              <textarea name="poem" placeholder="诗句意境" required style={{ ...iS, height: '60px' }} />
              
              <div style={{ marginBottom: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>1. 封面图 (用于画廊展示)</p>
                <input type="file" name="imageFile" accept="image/*" required style={{ fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>2. 完整画册 (PDF格式)</p>
                <input type="file" name="pdfFile" accept="application/pdf" required style={{ fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '25px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>3. 漫游视频 (MP4等格式)</p>
                <input type="file" name="videoFile" accept="video/*" required style={{ fontSize: '14px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowUpload(false)} style={{ flex: 1, padding: '10px' }} disabled={isSubmitting}>取消</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: '10px', background: isSubmitting ? '#666' : '#000', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? '上传中，请耐心等候...' : '提交全部文件'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 提取的通用样式
const iS = { width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' as 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = { 
  display: 'block', 
  textAlign: 'center' as 'center', 
  background: '#f8f7f5', 
  color: '#000', 
  textDecoration: 'none', 
  padding: '8px 0', 
  borderRadius: '4px', 
  fontSize: '13px', 
  border: '1px solid #e0e0e0',
  transition: 'background 0.2s'
};

export default App;