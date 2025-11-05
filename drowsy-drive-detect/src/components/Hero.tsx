import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-drowsy-detection.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-primary">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Công nghệ AI tiên tiến</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Phát hiện buồn ngủ
              <span className="block bg-gradient-to-r from-accent via-accent-glow to-accent bg-clip-text text-transparent">
                An toàn lái xe
              </span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-xl">
              Hệ thống nhận diện thông minh giúp cảnh báo tài xế khi có dấu hiệu buồn ngủ, 
              bảo vệ an toàn cho mọi chuyến đi.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/demo">
                <Button size="lg" className="bg-accent hover:bg-accent-glow text-white shadow-accent group">
                  Trải nghiệm ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                Tìm hiểu thêm
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-4xl font-bold text-accent">99.5%</div>
                <div className="text-sm text-white/80 mt-1">Độ chính xác</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">24/7</div>
                <div className="text-sm text-white/80 mt-1">Giám sát</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">&lt;0.5s</div>
                <div className="text-sm text-white/80 mt-1">Phản hồi</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary-glow/20 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Hệ thống nhận diện buồn ngủ"
              className="relative rounded-3xl shadow-2xl w-full border border-white/10"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;