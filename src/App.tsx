import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "./supabaseClient";

// --- 样式定义 ---
const styles = {
  container: { minHeight: "100vh", backgroundColor: "white", fontFamily: '"Microsoft YaHei", sans-serif', color: "#333" },
  homeLayout: { display: "flex", width: "100%", maxWidth: "1200px", height: "90vh", gap: "60px", padding: "40px", margin: "0 auto", alignItems: "center" },
  leftSection: { flex: 1.2, display: "flex", flexDirection: "column" as const, justifyContent: "center" },
  rightSection: { flex: 0.8, display: "flex", alignItems: "center", justifyContent: "center" },
  mainTitle: { fontSize: "72px", fontWeight: "normal", letterSpacing: "12px", margin: "0 0 40px 0", color: "#000" },
  sectionLabel: { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#000", borderLeft: "4px solid #84947C", paddingLeft: "12px" },
  introGrid: { display: "flex", gap: "20px", marginBottom: "35px" },
  introCard: { flex: 1, textAlign: "center" as const },
  introImg: { width: "100%", aspectRatio: "1.2/1", borderRadius: "4px", backgroundColor: "#f5f5f5", objectFit: "cover" as const, marginBottom: "10px", border: "1px solid #eee" },
  introText: { fontSize: "13px", color: "#555", lineHeight: "1.4" },
  workPreviewGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", width: "320px", marginBottom: "30px", cursor: "pointer" },
  previewBox: { height: "55px", background: "#f9f9f9", borderRadius: "4px", border: "1px solid #eee", overflow: "hidden" as const },
  primaryBtn: { backgroundColor: "#84947C", color: "white", padding: "14px 50px", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "16px", letterSpacing: "2px", alignSelf: "flex-start" },
  archiveLayout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: "280px", padding: "50px 30px", borderRight: "1px solid #eee", position: "fixed" as const, height: "100vh", backgroundColor: "#fff" },
  galleryArea: { marginLeft: "280px", flex: 1, padding: "50px" },
  shapeWrapper: { width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#fdfdfd", marginBottom: "15px" },
  formCard: { backgroundColor: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 15px 40px rgba(0,0,0,0.05)", width: "100%", maxWidth: "500px" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", outline: "none" },
  label: { fontSize: "14px", color: "#666", marginTop: "10px", display: "block", fontWeight: "bold" }
};

const getWindowShape = (type: string) => {
  switch (type) {
    case "圆形团扇": return { borderRadius: "50%" };
    case "扇形": return { clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)", transform: "scale(1.1)" }; 
    case "纵立长轴": return { aspectRatio: "2/3", width: "75%", borderRadius: "2px" };
    case "横长册页": return { aspectRatio: "3/2", width: "100%", borderRadius: "2px" };
    default: return { borderRadius: "4px" };
  }
};

export default function App() {
  const [page, setPage] = useState(0); 
  const [dbData, setDbData] = useState<any[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({ name: "", id: "", windowType: "圆形团扇", poem: "", file1: null, file2: null, file3: null, file4: null });

  const fetchData = async () => {
    const { data } = await supabase.from('homework').select('*').order('created_at', { ascending: false });
    if (data) setDbData(data);
  };

  useEffect(() => { fetchData(); }, []);

  const uploadFile = async (file: any, prefix: string) => {
    if (!file) return null;
    const name = `${prefix}_${user.id}_${Date.now()}`;
    const { error } = await supabase.storage.from('homework_files').upload(name, file);
    if (error) throw error;
    return supabase.storage.from('homework_files').getPublicUrl(name).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user.name || !user.id) return alert("请完整填写身份信息");
    setLoading(true);
    try {
      const urls = await Promise.all([
        uploadFile(user.file1, "t1"), 
        uploadFile(user.file2, "t2"), 
        uploadFile(user.file3, "t3"), 
        uploadFile(user.file4, "t4")
      ]);
      const story = JSON.stringify({ poem: user.poem, t1: urls[0], t2: urls[1], t3: urls[2], t4: urls[3] });
      const { error } = await supabase.from('homework').insert([{ student_id: user.id, student_name: user.name, window_type: user.windowType, story }]);
      if (error) throw error;
      
      alert("提交成功！已同步至云端档案馆");
      await fetchData(); // 关键：确保大厅数据最新
      setPage(4);        // 关键：提交完跳转到大厅 (Page 4)
    } catch (e: any) { 
      alert("提交出错: " + e.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        
        {/* PAGE 0: 首页 */}
        {page === 0 && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.homeLayout}>
            <div style={styles.leftSection}>
              <h1 style={styles.mainTitle}>山水图窗</h1>
              <p style={styles.sectionLabel}>课程介绍</p>
              <div style={styles.introGrid}>
                <div style={styles.introCard}><img src="/intro1.jpg" style={styles.introImg} /><div style={styles.introText}>1-山水画谱制作</div></div>
                <div style={styles.introCard}><img src="/intro2.jpg" style={styles.introImg} /><div style={styles.introText}>2-山水图窗模型</div></div>
                <div style={styles.introCard}><img src="/intro3.jpg" style={styles.introImg} /><div style={styles.introText}>3-AI辅助园林</div></div>
              </div>
              <p style={styles.sectionLabel}>作业展示</p>
              <div style={styles.workPreviewGrid} onClick={() => setPage(4)}>
                {[0, 1, 2, 3].map(i => {
                    const item = dbData[i];
                    let thumb = "";
                    try { thumb = JSON.parse(item.story).t1; } catch(e) {}
                    return <div key={i} style={styles.previewBox}>{thumb && <img src={thumb} style={{width:'100%', height:'100%', objectFit:'cover'}} />}</div>
                })}
              </div>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "2", marginBottom: "40px", fontStyle: "italic", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                “截纸数幅，以为画之头尾...” ——《闲情偶寄》
              </p>
              <button style={styles.primaryBtn} onClick={() => setPage(1)}>作业提交 ENTRY</button>
            </div>
            <div style={styles.rightSection}>
              <img src="/cover.png" style={{ width: "100%", maxHeight: "85%", objectFit: "contain" }} />
            </div>
          </motion.div>
        )}

        {/* PAGE 1: 身份 */}
        {page === 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <motion.div key="p1" style={styles.formCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{textAlign:'center', marginBottom:'30px'}}>1/3：基本身份</h3>
              <input style={styles.input} placeholder="学生姓名" onChange={(e) => setUser({...user, name: e.target.value})} />
              <input style={styles.input} placeholder="学号" onChange={(e) => setUser({...user, id: e.target.value})} />
              <button style={{...styles.primaryBtn, width: "100%", marginTop: "20px"}} onClick={() => setPage(2)}>下一步</button>
            </motion.div>
          </div>
        )}

        {/* PAGE 2: 内容 */}
        {page === 2 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <motion.div key="p2" style={styles.formCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{textAlign:'center', marginBottom:'30px'}}>2/3：选择窗型与诗句</h3>
              <select style={styles.input} value={user.windowType} onChange={(e) => setUser({...user, windowType: e.target.value})}>
                <option>圆形团扇</option><option>扇形</option><option>纵立长轴</option><option>横长册页</option>
              </select>
              <textarea style={{...styles.input, height: "120px"}} placeholder="在此写下感悟诗句..." onChange={(e) => setUser({...user, poem: e.target.value})} />
              <button style={{...styles.primaryBtn, width: "100%", marginTop: "20px"}} onClick={() => setPage(3)}>下一步</button>
            </motion.div>
          </div>
        )}

        {/* PAGE 3: 上传 */}
        {page === 3 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <motion.div key="p3" style={styles.formCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{textAlign:'center', marginBottom:'20px'}}>3/3：作业上传</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <span style={styles.label}>作业 1 (图片)</span><input type="file" accept="image/*" style={styles.input} onChange={(e) => setUser({...user, file1: e.target.files?.[0]})} />
                <span style={styles.label}>作业 2 (图片)</span><input type="file" accept="image/*" style={styles.input} onChange={(e) => setUser({...user, file2: e.target.files?.[0]})} />
                <span style={styles.label}>作业 3 (图片)</span><input type="file" accept="image/*" style={styles.input} onChange={(e) => setUser({...user, file3: e.target.files?.[0]})} />
                <span style={styles.label}>作业 4 (视频)</span><input type="file" accept="video/*" style={styles.input} onChange={(e) => setUser({...user, file4: e.target.files?.[0]})} />
              </div>
              <button style={{...styles.primaryBtn, width: "100%", marginTop: "20px"}} onClick={handleSubmit} disabled={loading}>
                {loading ? "正在同步..." : "确认提交作品"}
              </button>
            </motion.div>
          </div>
        )}

        {/* PAGE 4: 档案大厅 */}
        {page === 4 && (
          <motion.div key="archive" style={styles.archiveLayout} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={styles.sidebar}>
              <h2 style={{ fontSize: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>LIVING ARCHIVES</h2>
              <button style={{ ...styles.primaryBtn, width: "100%", marginTop: "40px" }} onClick={() => setPage(0)}>返回首页</button>
            </div>
            <div style={styles.galleryArea}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "40px" }}>
                {dbData.map(item => {
                  let content = { t1: "" };
                  try { content = JSON.parse(item.story); } catch(e) {}
                  return (
                    <div key={item.id} style={{ cursor: "pointer" }} onClick={() => setSelectedDetail(item)}>
                      <div style={styles.shapeWrapper}>
                        <img src={content.t1} style={{ width: "100%", height: "100%", objectFit: "cover", ...getWindowShape(item.window_type) }} />
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "bold" }}>{item.student_name}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>{item.window_type} / {item.student_id}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      {selectedDetail && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#fff", zIndex: 3000, padding: "80px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #000", paddingBottom: "20px" }}>
            <h1 style={{fontSize:'36px'}}>{selectedDetail.student_name} 的档案</h1>
            <button onClick={() => setSelectedDetail(null)} style={{ fontSize: "40px", border: "none", background: "none", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", marginTop: "50px" }}>
            <div>
               <p style={{fontStyle:'italic', fontSize:'24px'}}>“{JSON.parse(selectedDetail.story).poem}”</p>
               <video src={JSON.parse(selectedDetail.story).t4} controls style={{ width: "100%", marginTop: "20px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <img src={JSON.parse(selectedDetail.story).t1} style={{ width: "100%" }} />
              <img src={JSON.parse(selectedDetail.story).t2} style={{ width: "100%" }} />
              <img src={JSON.parse(selectedDetail.story).t3} style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}