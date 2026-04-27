import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ==========================================
// 1. 样式锁定区
// ==========================================
const sh: React.CSSProperties = { fontSize: '16px', marginBottom: '15px', borderLeft: '4px solid #000', paddingLeft: '10px' };
const imgBox: React.CSSProperties = { backgroundColor: '#fff', padding: '30px', border: '1px solid #ddd', marginBottom: '20px' };
const pageH: React.CSSProperties = { fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '30px', color: '#000', borderBottom: '2px solid #000', display: 'inline-block' };
const iS: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const uB: React.CSSProperties = { marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '11px' };

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
  <div style={{ backgroundColor: '#fff', padding: '40px 50px', borderRadius: '4px', maxWidth: '1000px', lineHeight: '2.2', fontSize: '15px', color: '#333', textAlign: 'justify' }}>
    <p style={{ marginBottom: '20px' }}><b>1. 知识方面：</b>建立对于中国传统山水的基本元素、构图原则，以及中国古典园林空间特征、组织方式的初步认识。在此基础上培养基本的空间阅读能力和审美能力。</p>
    <p style={{ marginBottom: '20px' }}><b>2. 操作方面：</b>通过“设计工作室”式教学法，强调“从做中学”。在动手操作的过程中学习中国传统山水空间基本知识、培养空间美学素养。同时，通过“设计思维”将理论认知进行融合，转化为动手操作的方法，最终以设计实物展示学习成果。</p>
    <p style={{ marginBottom: '20px' }}><b>3. 技法方面：</b>掌握基本的中国传统山水构图技巧，模型制作和摄影方法。通过模型以及模型照片表达设计概念，了解从“图像”到“空间”，从二维到三维的设计推进方式。</p>
    <p style={{ marginBottom: '20px' }}><b>4. 多专业融合：</b>利用学生多专业背景，鼓励学生在空间美学学习和设计创作过程中寻找与自己专业的接口。通过这个课程，各专业学生可以了解他们可以在哪些方面对我们的生存环境的可持续性发展作出贡献。</p>
    <p><b>5. 课程思政方面：</b>通过建立基本的对于中国传统山水空间的审美认识，增强学生对于中国传统山水文化的理解，提升中华文化自信。并通过课程不同阶段的练习，培养学生探索传承创新中国传统文化的主动性和责任感。</p>
  </div>
);

const COURSE_SCHEDULE = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', maxWidth: '1100px', paddingBottom: '100px' }}>
    <div style={imgBox}><h3 style={sh}>1-山水意境确定</h3><img src="/sch_09.jpg" style={{ width: '100%' }} /></div>
    <div style={imgBox}><h3 style={sh}>1-山水画谱制作</h3><img src="/sch_10.jpg" style={{ width: '100%', marginBottom: '20px' }} /><img src="/sch_11.jpg" style={{ width: '100%' }} /></div>
    <div style={imgBox}><h3 style={sh}>2-山水图窗模型制作</h3><img src="/sch_12.jpg" style={{ width: '100%', marginBottom: '20px' }} /><img src="/sch_13.jpg" style={{ width: '100%', marginBottom: '20px' }} /><img src="/sch_14.jpg" style={{ width: '100%' }} /></div>
    <div style={imgBox}><h3 style={sh}>瞻园考察</h3><img src="/sch_15.jpg" style={{ width: '100%' }} /></div>
    <div style={imgBox}><h3 style={sh}>3-AI辅助山水布景的园林空间再现</h3><img src="/sch_16.jpg" style={{ width: '100%', marginBottom: '30px' }} /><img src="/sch_17.jpg" style={{ width: '100%' }} /></div>
  </div>
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
  const [contentMode, setContentMode] = useState<'works' | 'topic' | 'goal' | 'schedule'>('works');
  const [showUpload, setShowUpload] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [filterName, setFilterName] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('全部');

  const fetchWorks = async () => {
    const { data } = await supabase.from('works').select('*').order('created_at', { ascending: false });
    if (data) setWorks(data);
  };

  useEffect(() => { fetchWorks(); }, []);

  // 综合筛选逻辑：依然保持且，但在点击事件里做了互斥处理
  const filteredWorks = works.filter(work => {
    const nameMatch = filterName ? work.name === filterName : true;
    const typeMatch = filterType === '全部' ? true : work.window_type === filterType;
    return nameMatch && typeMatch;
  });

  const studentNames = Array.from(new Set(works.map(w => w.name)));

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这份作业吗？")) return;
    await supabase.from('works').delete().eq('id', id);
    setSelectedWork(null);
    fetchWorks();
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
      alert("请完整上传资料");
      setIsSubmitting(false);
      return;
    }
    try {
      const uploadFile = async (file: File) => {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
        await supabase.storage.from('works-images').upload(fileName, file);
        const { data } = supabase.storage.from('works-images').getPublicUrl(fileName);
        return data.publicUrl;
      };
      const imageUrl = await uploadFile(files.image);
      const videoUrl = await uploadFile(files.video);
      const albumUrls = await Promise.all(Array.from(files.albums).map(file => uploadFile(file)));
      await supabase.from('works').insert([{
        name: formData.get('name'),
        student_id: formData.get('student_id'),
        window_type: formData.get('window_type'),
        poem: formData.get('poem'),
        image_url: imageUrl,
        video_url: videoUrl,
        album_images: albumUrls 
      }]);
      alert("发布成功！");
      fetchWorks(); setShowUpload(false); setContentMode('works');
    } catch (error: any) { alert(error.message); } finally { setIsSubmitting(false); }
  };

  const getWindowStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case '圆形团扇': return { borderRadius: '50%', width: '180px', height: '180px' };
      case '扇面': return { width: '220px', height: '140px', borderRadius: '4px' };
      case '纵长立轴': return { width: '155px', height: '210px', borderRadius: '2px' };
      case '横长册页': return { width: '220px', height: '145px', borderRadius: '4px' };
      default: return { width: '180px', height: '180px', borderRadius: '4px' };
    }
  };

  if (page === 'home') {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%' }}>
          <h1 style={{ fontSize: '100px', fontWeight: 'bold', margin: '0 0 20px 0', letterSpacing: '10px' }}>山水图窗</h1>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#000' }}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
            <p style={{ margin: '0' }}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
          </div>
          <button onClick={() => { setPage('gallery'); setContentMode('works'); }} style={{ marginTop:'60px', width: 'fit-content', padding: '12px 50px', backgroundColor: '#f5f5f5', border: 'none', fontSize: '20px', cursor: 'pointer' }}>点击进入</button>
        </div>
        <div style={{ flex: '1.2' }}><img src="/long-cover.png" alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '25%', padding: '30px', position: 'fixed', height: '100vh', borderRight: '1px solid #eee', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 25px 0', fontWeight: 'bold', cursor: 'pointer', borderBottom: '1px solid #000', paddingBottom:'10px' }} onClick={() => { setContentMode('works'); setFilterName(null); setFilterType('全部'); }}>山水图窗</h1>
        
        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '10px' }}>基本信息</h2>
          {BASIC_INFO}
        </section>

        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '8px' }}>课程介绍</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '2', color: '#666' }}>
            <li onClick={() => setContentMode('topic')} style={{ cursor: 'pointer', textDecoration: contentMode === 'topic' ? 'underline' : 'none' }}>• 选题依据</li>
            <li onClick={() => setContentMode('goal')} style={{ cursor: 'pointer', textDecoration: contentMode === 'goal' ? 'underline' : 'none' }}>• 课程目标</li>
            <li onClick={() => setContentMode('schedule')} style={{ cursor: 'pointer', textDecoration: contentMode === 'schedule' ? 'underline' : 'none' }}>• 课程安排</li>
          </ul>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        {contentMode === 'works' && (
          <>
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>学生姓名</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span onClick={() => { setFilterName(null); setFilterType('全部'); }} style={{ cursor: 'pointer', fontSize: '14px', color: filterName === null ? '#333' : '#999' }}>全部学生</span>
                {studentNames.map(name => (
                  <span key={name} onClick={() => { setFilterName(name); setFilterType('全部'); }} style={{ cursor: 'pointer', fontSize: '14px', color: filterName === name ? '#333' : '#999' }}>{name}</span>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>窗型筛选</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['全部', '扇面', '圆形团扇', '横长册页', '纵长立轴'].map(type => (
                  <button 
                    key={type} 
                    onClick={() => { 
                      setFilterType(type); 
                      setFilterName(null); // 修改点：点击窗型时，清除学生姓名过滤
                    }} 
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: filterType === type ? '#333' : '#fff', color: filterType === type ? '#fff' : '#666', cursor: 'pointer', fontSize: '11px' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '8px' }}>成果&展示</h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: '2.2', color: '#333' }}>
            <li onClick={() => setContentMode('works')} style={{ cursor: 'pointer', textDecoration: contentMode === 'works' ? 'underline' : 'none' }}>• 作业展示</li>
            <li onClick={() => setShowUpload(true)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>• 作业提交</li>
          </ul>
        </section>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: '1px solid #000', padding: '6px 15px', cursor: 'pointer', fontSize: '11px' }}>返回封面</button>
      </div>

      <div style={{ marginLeft: '25%', flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#f9f9f9', boxSizing: 'border-box' }}>
        {contentMode === 'works' && (
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '40px' }}>
              {filteredWorks.map((work) => (
                <div key={work.id} onClick={() => setSelectedWork(work)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ height: '230px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                    <div style={{ overflow: 'hidden', border:'1px solid #eee', ...getWindowStyle(work.window_type) }}>
                      <img src={work.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px' }}>
                    <p style={{ fontWeight: 'bold', margin: '0' }}>{work.name} / {work.student_id}</p>
                    <p style={{ color: '#999', margin: '3px 0' }}>{work.window_type}</p>
                    <p style={{ fontStyle: 'italic', color: '#666', lineHeight: '1.4' }}>{work.poem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {contentMode === 'goal' && <div style={{ padding: '40px 60px' }}><h2 style={pageH}>· 课程目标</h2>{COURSE_GOAL}</div>}
        {contentMode === 'schedule' && <div style={{ padding: '40px 60px' }}><h2 style={pageH}>· 课程安排</h2>{COURSE_SCHEDULE}</div>}
        {contentMode === 'topic' && (
          <div style={{ padding: '40px 60px' }}>
            <h2 style={pageH}>· 选题依据</h2>
            {[1, 2, 3, 4, 5].map(i => <div key={i} style={imgBox}><img src={`/topic_${i}.jpg`} style={{ width: '100%' }} /></div>)}
          </div>
        )}
      </div>

      {selectedWork && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#fff', zIndex: 2000, overflowY: 'auto' }}>
          <div style={{ position: 'fixed', top: '25px', right: '40px', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 2100 }}>
            <button onClick={() => handleDelete(selectedWork.id!)} style={{ padding: '6px 12px', backgroundColor: '#f0f0f0', color: '#999', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>删除</button>
            <button onClick={() => setSelectedWork(null)} style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>✕</button>
          </div>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '32px' }}>{selectedWork.name} / {selectedWork.student_id}</h2>
              <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '15px' }}>{selectedWork.poem}</p>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {selectedWork.album_images.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '100%' }}>
                   <img src={url} style={{ width: '100%', display: 'block', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }} alt={`页码${i+1}`} />
                   {i === 6 && (
                     <div style={{ position: 'absolute', top: '15%', left: '40%', width: '55%', height: '72%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <video src={selectedWork.video_url} controls autoPlay loop muted style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} />
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', width: '450px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
             <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>提交成果总结</h2>
             <form onSubmit={handleSubmit}>
                <input name="name" placeholder="姓名" required style={iS} />
                <input name="student_id" placeholder="学号" required style={iS} />
                <textarea name="poem" placeholder="输入诗句" required style={{...iS, height: '80px'}} />
                <select name="window_type" style={iS} required>
                  <option value="扇面">扇面</option><option value="圆形团扇">圆形团扇</option><option value="横长册页">横长册页</option><option value="纵长立轴">纵长立轴</option>
                </select>
                <div style={uB}><p>封面卡片</p><input type="file" name="imageFile" accept="image/*" required /></div>
                <div style={uB}><p>画册页 (确保第7张为开口底图)</p><input type="file" name="albumFiles" accept="image/*" multiple required /></div>
                <div style={uB}><p>演示视频</p><input type="file" name="videoFile" accept="video/*" required /></div>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  style={{ 
                    width: '100%', padding: '16px', 
                    background: isSubmitting ? '#999' : '#000', 
                    color: '#fff', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold', borderRadius: '12px' 
                  }}
                >
                  {isSubmitting ? '正在上传，请稍候...' : '确认发布'}
                </button>
                <button type="button" onClick={()=>setShowUpload(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>取消</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;