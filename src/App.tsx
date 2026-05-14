import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ==========================================
// 1. 样式锁定区 (加入响应式变量)
// ==========================================
const isMobile = window.innerWidth < 768;

const sh: React.CSSProperties = { fontSize: '16px', marginBottom: '15px', borderLeft: '4px solid #000', paddingLeft: '10px' };
const imgBox: React.CSSProperties = { backgroundColor: '#fff', padding: isMobile ? '15px' : '30px', border: '1px solid #ddd', marginBottom: '20px' };
const pageH: React.CSSProperties = { fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px', color: '#000', borderBottom: '2px solid #000', display: 'inline-block' };
const iS: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const uB: React.CSSProperties = { marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '11px' };

const flipBtnS: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none',
  padding: isMobile ? '15px 5px' : '20px 10px', cursor: 'pointer', fontSize: isMobile ? '18px' : '24px', zIndex: 10,
  borderRadius: '4px', transition: 'background 0.3s'
};

// ==========================================
// 2. 课程内容锁定区
// ==========================================
const BASIC_INFO = (
  <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '1.8', color: '#666', marginLeft: '5px' }}>
    <li style={{ color: '#666', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</li>
    <li style={{ color: '#999', fontSize: '10px', marginBottom: '5px' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</li>
    <li>2026春季学期</li>
    <li>指导教师：邵星宇 | 助教：张羽欣 李亚文</li>
  </ul>
);

const COURSE_GOAL = (
  <div style={{ backgroundColor: '#fff', padding: isMobile ? '20px' : '40px 50px', borderRadius: '4px', maxWidth: '1000px', lineHeight: '2.2', fontSize: '15px', color: '#333', textAlign: 'justify' }}>
    <p style={{ marginBottom: '20px' }}><b>1. 知识方面：</b>建立对于中国传统山水的基本元素、构图原则，以及中国古典园林空间特征、组织方式的初步认识。</p>
    <p style={{ marginBottom: '20px' }}><b>2. 操作方面：</b>通过“设计工作室”式教学法，强调“从做中学”。</p>
    <p style={{ marginBottom: '20px' }}><b>3. 技法方面：</b>掌握基本的中国传统山水构图技巧，模型制作和摄影方法。</p>
    <p style={{ marginBottom: '20px' }}><b>4. 多专业融合：</b>利用学生多专业背景，鼓励学生在空间美学学习和设计创作过程中寻找与自己专业的接口。</p>
    <p><b>5. 课程思政方面：</b>增强学生对于中国传统山水文化的理解，提升中华文化自信。</p>
  </div>
);

const MANUAL_IMAGES = Array.from({ length: 30 }, (_, i) => 
  `/manual_${(i + 1).toString().padStart(2, '0')}.jpg`
);

// ==========================================
// 3. 主程序逻辑
// ==========================================
interface Work {
  id?: number;
  name: string;
  student_id: string;
  window_type: string;
  poem: string;
  image_url: string; 
  video_url: string; 
  album_images: string[]; 
}

function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');
  const [contentMode, setContentMode] = useState<'works' | 'topic' | 'goal' | 'manual-view'>('works');
  const [currentManualPage, setCurrentManualPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [filterName, setFilterName] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('全部');

  // 监听窗口大小变化
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const mobile = width < 768;

  const fetchWorks = async () => {
    const { data } = await supabase.from('works').select('*').order('created_at', { ascending: false });
    if (data) setWorks(data);
  };

  useEffect(() => { fetchWorks(); }, []);

  const filteredWorks = works.filter(work => {
    const nameMatch = filterName ? work.name === filterName : true;
    const typeMatch = filterType === '全部' ? true : work.window_type === filterType;
    return nameMatch && typeMatch;
  });

  const studentNames = Array.from(new Set(works.map(w => w.name)));

  const changeManualPage = (direction: number) => {
    setCurrentManualPage((prev) => {
      const nextP = prev + direction;
      if (nextP < 0) return MANUAL_IMAGES.length - 1;
      if (nextP >= MANUAL_IMAGES.length) return 0;
      return nextP;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const files = {
      image: (e.currentTarget.querySelector('input[name="imageFile"]') as HTMLInputElement).files?.[0],
      video: (e.currentTarget.querySelector('input[name="videoFile"]') as HTMLInputElement).files?.[0],
      albums: (e.currentTarget.querySelector('input[name="albumFiles"]') as HTMLInputElement).files
    };
    if (!files.image || !files.video || !files.albums || files.albums.length === 0) {
      alert("请完整上传！");
      setIsSubmitting(false);
      return;
    }
    try {
      const uploadFile = async (file: File) => {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
        const { error } = await supabase.storage.from('works-images').upload(fileName, file);
        if (error) throw error;
        return supabase.storage.from('works-images').getPublicUrl(fileName).data.publicUrl;
      };
      const imageUrl = await uploadFile(files.image); 
      const videoUrl = await uploadFile(files.video);
      const albumUrls = await Promise.all(Array.from(files.albums).map(file => uploadFile(file)));
      const { error } = await supabase.from('works').insert([{
        name: formData.get('name'),
        student_id: formData.get('student_id'),
        window_type: formData.get('window_type'),
        poem: formData.get('poem'),
        image_url: imageUrl, 
        video_url: videoUrl, 
        album_images: albumUrls 
      }]);
      if (!error) { fetchWorks(); setShowUpload(false); setContentMode('works'); }
    } catch (error: any) { alert("失败：" + error.message); } finally { setIsSubmitting(false); }
  };

  const getWindowStyle = (type: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { overflow: 'hidden', backgroundColor: '#000', border: '1px solid #eee' };
    switch (type) {
      case '圆形团扇': return { ...baseStyle, borderRadius: '50%', width: mobile ? '100px' : '150px', height: mobile ? '100px' : '150px' };
      case '扇面': return { ...baseStyle, width: mobile ? '140px' : '200px', height: mobile ? '80px' : '120px', borderRadius: '8px' };
      default: return { ...baseStyle, width: mobile ? '110px' : '150px', height: mobile ? '110px' : '150px', borderRadius: '4px' };
    }
  };

  const renderItemMedia = (url: string) => {
    if (!url) return <div style={{width:'100%', height:'100%', backgroundColor:'#eee'}} />;
    const isVideo = /\.(mp4|mov|webm|ogg|m4v)/i.test(url.split('?')[0]);
    if (isVideo) {
      return <video key={url} src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />;
    }
    return <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="artwork" 
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.dataset.retried) {
          target.dataset.retried = "true";
          target.src = url.startsWith('/') ? url.substring(1) : url;
        }
      }} 
    />;
  };

  if (page === 'home') {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: mobile ? 'column' : 'row', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', order: mobile ? 2 : 1 }}>
          <h1 style={{ fontSize: mobile ? '48px' : '100px', fontWeight: 'bold', margin: '0', letterSpacing: mobile ? '2px' : '10px' }}>山水图窗</h1>
          <button onClick={() => { setPage('gallery'); setContentMode('works'); }} style={{ margin: '30px 0', width: 'fit-content', padding: '12px 50px', backgroundColor: '#f5f5f5', border: 'none', fontSize: '20px', cursor: 'pointer' }}>点击进入</button>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#000' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
            <p style={{ margin: '0' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          </div>
        </div>
        <div style={{ flex: mobile ? '0.6' : '1.2', order: mobile ? 1 : 2 }}>
          <img src="/long-cover.png" alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', minHeight: '100vh', backgroundColor: '#fff' }}>
      
      {/* 侧边栏适配 */}
      <div style={{ 
        width: mobile ? '100%' : '25%', 
        padding: '30px', 
        position: mobile ? 'relative' : 'fixed', 
        height: mobile ? 'auto' : '100vh', 
        borderRight: mobile ? 'none' : '1px solid #eee', 
        borderBottom: mobile ? '1px solid #eee' : 'none',
        overflowY: 'auto', 
        boxSizing: 'border-box',
        zIndex: 100
      }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 20px 0', fontWeight: 'bold', borderBottom: '1px solid #000' }} onClick={() => setContentMode('works')}>山水图窗</h1>
        <section style={{ marginBottom: '20px' }}>{BASIC_INFO}</section>
        <div style={{ display: mobile ? 'flex' : 'block', gap: '15px', flexWrap: 'wrap' }}>
          <li onClick={() => setContentMode('topic')} style={{ listStyle:'none', fontSize:'13px', cursor: 'pointer', marginBottom:'5px' }}>• 选题依据</li>
          <li onClick={() => setContentMode('goal')} style={{ listStyle:'none', fontSize:'13px', cursor: 'pointer', marginBottom:'5px' }}>• 课程目标</li>
          <li onClick={() => { setContentMode('manual-view'); setCurrentManualPage(0); }} style={{ listStyle:'none', fontSize:'13px', fontWeight:'bold', cursor: 'pointer', marginBottom:'5px' }}>• 山水画谱</li>
          <li onClick={() => setContentMode('works')} style={{ listStyle:'none', fontSize:'13px', cursor: 'pointer', marginBottom:'5px' }}>• 作业展示</li>
          <li onClick={() => setShowUpload(true)} style={{ listStyle:'none', fontSize:'13px', cursor: 'pointer', textDecoration:'underline' }}>• 作业提交</li>
        </div>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: '1px solid #000', padding: '5px 10px', fontSize: '11px', marginTop: '15px' }}>返回封面</button>
      </div>

      {/* 内容区适配 */}
      <div style={{ 
        marginLeft: mobile ? '0' : '25%', 
        flex: 1, 
        padding: mobile ? '10px' : '0',
        backgroundColor: '#f9f9f9' 
      }}>
        {contentMode === 'manual-view' && (
          <div style={{ padding: mobile ? '20px' : '40px 60px', height: 'auto', minHeight:'400px' }}>
            <h2 style={pageH}>· 山水画谱</h2>
            <div style={{ backgroundColor: '#fff', padding: '10px', position: 'relative', height: mobile ? '300px' : '500px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <button style={flipBtnS} onClick={() => changeManualPage(-1)}>&#10094;</button>
              {renderItemMedia(MANUAL_IMAGES[currentManualPage])}
              <button style={{ ...flipBtnS, right: '5px' }} onClick={() => changeManualPage(1)}>&#10095;</button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>{currentManualPage + 1} / 30</p>
          </div>
        )}

        {contentMode === 'works' && (
          <div style={{ padding: mobile ? '20px' : '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? '140px' : '210px'}, 1fr))`, gap: '15px' }}>
              {filteredWorks.map((work) => (
                <div key={work.id} onClick={() => setSelectedWork(work)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ height: mobile ? '120px' : '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={getWindowStyle(work.window_type)}>{renderItemMedia(work.image_url)}</div>
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '5px' }}>{work.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {contentMode === 'goal' && <div style={{ padding: '20px' }}><h2 style={pageH}>· 课程目标</h2>{COURSE_GOAL}</div>}
        {contentMode === 'topic' && (
          <div style={{ padding: '20px' }}>
            <h2 style={pageH}>· 选题依据</h2>
            {[1, 2, 3, 4, 5].map(i => <div key={i} style={imgBox}><img src={`/topic_${i}.jpg`} style={{ width: '100%' }} alt="topic" /></div>)}
          </div>
        )}
      </div>

      {/* 弹窗遮罩适配 */}
      {selectedWork && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#fff', zIndex: 2000, overflowY: 'auto', padding: mobile ? '40px 10px' : '80px' }}>
          <button onClick={() => setSelectedWork(null)} style={{ position: 'fixed', top: '10px', right: '10px', fontSize: '24px', border: 'none', background: 'none' }}>✕</button>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>{selectedWork.name}</h2>
            {selectedWork.album_images?.map((url, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
                <img src={url} style={{ width: '100%' }} alt="album" />
                {i === 6 && (
                  <div style={{ position: 'absolute', top: '15%', left: '40%', width: '55%', height: '72%' }}>
                    <video src={selectedWork.video_url} controls style={{ width: '100%', height: '100%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
