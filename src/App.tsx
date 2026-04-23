import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "./supabaseClient";

// --- 统一样式定义 ---
const styles = {
  container: { minHeight: "100vh", backgroundColor: "white", fontFamily: '"Microsoft YaHei", "SimSun", serif', color: "#333" },
  homeLayout: { display: "flex", width: "100%", maxWidth: "1300px", height: "95vh", gap: "80px", padding: "40px", margin: "0 auto", alignItems: "flex-start", paddingTop: "60px" },
  leftSection: { flex: 1.3, display: "flex", flexDirection: "column" as const },
  rightSection: { flex: 0.7, display: "flex", flexDirection: "column" as const, alignItems: "center" },
  
  // 标题区域
  headerArea: { marginBottom: "60px" },
  mainTitle: { fontSize: "86px", fontWeight: "900", letterSpacing: "15px", margin: "0 0 10px 0", color: "#000" },
  subTitleCn: { fontSize: "18px", color: "#333", margin: "5px 0", letterSpacing: "2px", fontWeight: "bold" },
  subTitleEn: { fontSize: "16px", color: "#666", margin: "0", fontFamily: "serif", fontStyle: "italic" },

  // 栏目标签
  sectionLabel: { fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#333", marginTop: "40px" },
  
  // 课程介绍
  introGrid: { display: "flex", gap: "25px", marginBottom: "20px" },
  introCard: { width: "120px", textAlign: "left" as const },
  introImg: { width: "100%", aspectRatio: "1/1", objectFit: "cover" as const, marginBottom: "8px", border: "1px solid #eee" },
  introText: { fontSize: "11px", color: "#666", lineHeight: "1.4" },

  // 作业展示预览 (九宫格风格)
  workPreviewGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", width: "420px", cursor: "pointer" },
  previewBox: { width: "100%", aspectRatio: "4/3", background: "#f9f9f9", border: "1px solid #eee", overflow: "hidden" as const },

  // 按钮样式
  primaryBtn: { backgroundColor: "#84947C", color: "white", padding: "12px 40px", borderRadius: "2px", border: "none", cursor: "pointer", fontSize: "15px", letterSpacing: "2px", marginTop: "40px", alignSelf: "flex-start" },

  // 详情/表单/大厅样式保持不变...
  archiveLayout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: "280px", padding: "50px 30px", borderRight: "1px solid #eee", position: "fixed" as const, height: "100vh", backgroundColor: "#fff" },
  galleryArea: { marginLeft: "280px", flex: 1, padding: "50px" },
  shapeWrapper: { width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#fdfdfd", marginBottom: "15px" },
  formCard: { backgroundColor: "white", borderRadius: "8px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%", maxWidth: "450px" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px" }
};

const getWindowShape = (type: string) => {
  switch (type) {
    case "圆形团扇": return { borderRadius: "50%" };
    case "扇形": return { clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }; 
    case "纵立长轴": return { aspectRatio: "2/3", width: "75%" };
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
    await supabase.storage.from('homework_files').upload(name, file);
    return supabase.storage.from('homework_files').getPublicUrl(name).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user.name || !user.id) return alert("请填写身份信息");
    setLoading(true);
    try {
      const urls = await Promise.all([uploadFile(user.file1, "t1"), uploadFile(user.file2, "t2"), uploadFile(user.file3, "t3"), uploadFile(user.file4, "t4")]);
      const story = JSON.stringify({ poem: user.poem, t1: urls[0], t2: urls[1], t3: urls[2], t4: urls[3] });
      await supabase.from('homework').insert([{ student_id: user.id, student_name: user.name, window_type: user.windowType, story }]);
      alert("提交成功");
      fetchData();
      setPage(4);
    } catch (e) { alert("提交失败"); }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        
        {page === 0 && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.homeLayout}>
            {/* 左侧内容区 */}
            <div style={styles.leftSection}>
              <div style={styles.headerArea}>
                <h1 style={styles.mainTitle}>山水图窗</h1>
                <p style={styles.subTitleCn}>《艺术与设计思维专题5：中国传统山水的意象与空间》</p>
                <p style={styles.subTitleEn}>Topic 5: The Imagery and Space of Chinese Traditional Landscape</p>
              </div>

              <p style={styles.sectionLabel}>课程介绍</p>
              <div style={styles.introGrid}>
                <div style={styles.introCard}>
                  <img src="/intro1.jpg" style={styles.introImg} />
                  <div style={styles.introText}>1-山水画谱制作</div>
                </div>
                <div style={styles.introCard}>
                  <img src="/intro2.jpg" style={styles.introImg} />
                  <div style={styles.introText}>2-山水图窗模型</div>
                </div>
                <div style={styles.introCard}>
                  <img src="/intro3.jpg" style={styles.introImg} />
                  <div style={styles.introText}>3-AI辅助山水布景的园林空间再现</div>
                </div>
              </div>

              <p style={styles.sectionLabel}>作业展示</p>
              <div style={styles.workPreviewGrid} onClick={() => setPage(4)}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                    const item = dbData[i];
                    let thumb = "";
                    try { thumb = JSON.parse(item.story).t1; } catch(e) {}
                    return <div key={i} style={styles.previewBox}>
                        {thumb && <img src={thumb} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                    </div>
                })}
              </div>

              <button style={styles.primaryBtn} onClick={() => setPage(1)}>作业提交 ENTRY</button>
            </div>

            {/* 右侧插图区 */}
            <div style={styles.rightSection}>
              <img src="/cover.png" style={{ width: "100%", maxWidth: "500px", border: "1px solid #eee" }} />
              <div style={{ marginTop: "30px", width: "100%", maxWidth: "500px" }}>
                <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.8", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
                  “截纸数幅，以为画之头尾，及左右镶边，头尾贴于窗之上下，镇边贴于两边，俨然堂画一幅，但虚其中，非虚其中，欲以屋后之山代之也。” ——《闲情偶寄》
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 后续页面（1-4）保持原有逻辑即可，此处略 --- */}
        {page === 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={styles.formCard}>
                    <h3>1/3 基本信息</h3>
                    <input style={styles.input} placeholder="姓名" onChange={(e)=>setUser({...user, name: e.target.value})} />
                    <input style={styles.input} placeholder="学号" onChange={(e)=>setUser({...user, id: e.target.value})} />
                    <button style={styles.primaryBtn} onClick={()=>setPage(2)}>下一步</button>
                </div>
            </div>
        )}
        {/* ... 请保留之前代码中 Page 2, 3, 4 的完整内容 ... */}

      </AnimatePresence>
    </div>
  );
}