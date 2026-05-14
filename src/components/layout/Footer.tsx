import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-orange-50/50 border-t border-orange-100 rounded-t-[64px] pt-16 pb-16 px-4 md:px-8 flex flex-col items-center justify-center mt-32 shrink-0">
      <div className="text-orange-500 text-[20px] font-bold mb-8">
        Tripia
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-8">
        {["ABOUT US", "SAFETY", "JOURNAL", "COMMUNITY", "PRIVACY"].map((item) => (
          <Link key={item} to="#" className="text-slate-500 text-[12px] font-light tracking-[1.2px] hover:text-orange-500 transition-colors">
            {item}
          </Link>
        ))}
      </div>
      <div className="text-slate-400 text-[12px] font-light tracking-[1.2px] uppercase text-center">
        © 2024 TRIPIA. TRAVEL WITH SOUL.
      </div>
    </footer>
  );
}
