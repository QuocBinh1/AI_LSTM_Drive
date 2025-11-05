import { Eye, Bell, Brain, Zap, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Eye,
    title: "Nhận diện khuôn mặt",
    description: "Phân tích chuyển động mắt và biểu hiện khuôn mặt theo thời gian thực"
  },
  {
    icon: Brain,
    title: "AI thông minh",
    description: "Thuật toán học sâu được huấn luyện với hàng triệu mẫu dữ liệu"
  },
  {
    icon: Bell,
    title: "Cảnh báo kịp thời",
    description: "Âm thanh và rung động đa cấp độ để đánh thức tài xế"
  },
  {
    icon: Zap,
    title: "Xử lý nhanh",
    description: "Phản hồi dưới 0.5 giây với độ chính xác cao"
  },
  {
    icon: Shield,
    title: "Bảo mật tuyệt đối",
    description: "Dữ liệu được mã hóa và xử lý cục bộ trên thiết bị"
  },
  {
    icon: TrendingUp,
    title: "Báo cáo chi tiết",
    description: "Thống kê hành trình và mức độ mệt mỏi theo thời gian"
  }
];

const Features = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Tính năng vượt trội
          </h2>
          <p className="text-lg text-muted-foreground">
            Công nghệ tiên tiến nhất để đảm bảo an toàn tuyệt đối cho mọi chuyến đi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-card border-border/50 bg-card backdrop-blur-sm transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;