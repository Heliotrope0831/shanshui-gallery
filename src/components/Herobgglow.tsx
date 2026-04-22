import "@/styles/Herobgglow.css";
interface HerobgglowProps {
    id?: string;
    className?: string;
}
const Herobgglow = (props: HerobgglowProps) => {
    const { id, className = "" } = props;

    return (
        <div className={`component-6_1 ${className}`} id={id}>
            <div id="6_1" className="Pixso-symbol-6_1">
                <div id="2_14" className="Pixso-rectangle-2_14"></div>
                <div id="6_2" className="Pixso-frame-6_2"></div>
            </div>
        </div>
    );
};
export default Herobgglow;
