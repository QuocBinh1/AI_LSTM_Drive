import { Shield, Heart, TrendingDown, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const benefits = [
  {
    icon: Shield,
    stat: "85%",
    label: "Giảm tai nạn",
    description: "Giảm đáng kể tai nạn do buồn ngủ"
  },
  {
    icon: Heart,
    stat: "100%",
    label: "An tâm",
    description: "Tài xế và gia đình luôn yên tâm"
  },
  {
    icon: TrendingDown,
    stat: "70%",
    label: "Tiết kiệm",
    description: "Giảm chi phí sửa chữa và bảo hiểm"
  },
  {
    icon: Users,
    stat: "50K+",
    label: "Người dùng",
    description: "Tin tưởng và sử dụng hàng ngày"
  }
];

const Benefits = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Lợi ích vượt trội
          </h2>
          <p className="text-lg text-muted-foreground">
            Những con số ấn tượng chứng minh hiệu quả của hệ thống
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`text-center group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                <benefit.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {benefit.stat}
              </div>
              <div className="text-xl font-semibold mb-2 text-foreground">
                {benefit.label}
              </div>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;