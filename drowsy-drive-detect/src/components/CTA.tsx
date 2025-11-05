import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTA = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-accent via-accent-glow to-accent text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Sẵn sàng bảo vệ
            <span className="block">chuyến đi của bạn?</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Trải nghiệm ngay hôm nay và cảm nhận sự khác biệt mà công nghệ AI mang lại cho an toàn lái xe
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 shadow-2xl group h-14 px-8 text-lg">
                Bắt đầu dùng thử
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-14 px-8 text-lg">
              <Mail className="mr-2 w-5 h-5" />
              Liên hệ tư vấn
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-white/20">
            <p className="text-white/80 mb-4">Được tin dùng bởi các đối tác hàng đầu</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-2xl font-bold">VINFAST</div>
              <div className="text-2xl font-bold">THACO</div>
              <div className="text-2xl font-bold">TOYOTA</div>
              <div className="text-2xl font-bold">HONDA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;