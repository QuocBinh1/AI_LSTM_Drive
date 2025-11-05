import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, AlertTriangle, Eye, Activity } from "lucide-react";
import { Link } from "react-router-dom";

type DriverStatus = "alert" | "drowsy" | "danger";

const Demo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<DriverStatus>("alert");
  const [warnings, setWarnings] = useState({
    total: 0,
    drowsy: 0,
    danger: 0,
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Không thể truy cập camera:", error);
      alert("Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  // Simulate status changes (in real app, this would be from AI detection)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.9) {
        setStatus("danger");
        setWarnings(prev => ({
          total: prev.total + 1,
          drowsy: prev.drowsy,
          danger: prev.danger + 1,
        }));
      } else if (rand > 0.7) {
        setStatus("drowsy");
        setWarnings(prev => ({
          total: prev.total + 1,
          drowsy: prev.drowsy + 1,
          danger: prev.danger,
        }));
      } else {
        setStatus("alert");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const getStatusConfig = () => {
    switch (status) {
      case "alert":
        return {
          label: "Tỉnh táo",
          color: "bg-green-500",
          textColor: "text-green-500",
          bgColor: "bg-green-500/10",
        };
      case "drowsy":
        return {
          label: "Buồn ngủ",
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        };
      case "danger":
        return {
          label: "Nguy hiểm",
          color: "bg-red-500",
          textColor: "text-red-500",
          bgColor: "bg-red-500/10",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hệ thống nhận diện buồn ngủ
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Camera giám sát
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Camera chưa được kích hoạt</p>
                        <Button onClick={startCamera} size="lg" className="bg-primary hover:bg-primary/90">
                          Bật camera
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  {isStreaming && (
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge className={`${statusConfig.color} text-white text-lg px-4 py-2`}>
                        <Activity className="w-4 h-4 mr-2" />
                        Đang giám sát
                      </Badge>
                    </div>
                  )}
                </div>

                {isStreaming && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={stopCamera} variant="outline">
                      Dừng camera
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status & Statistics */}
          <div className="space-y-6">
            {/* Driver Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Trạng thái tài xế
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${statusConfig.bgColor} rounded-lg p-6 text-center transition-all duration-500`}>
                  <div className={`w-16 h-16 rounded-full ${statusConfig.color} mx-auto mb-4 animate-pulse`}></div>
                  <h3 className={`text-2xl font-bold ${statusConfig.textColor} mb-2`}>
                    {statusConfig.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {status === "alert" && "Tài xế đang tỉnh táo"}
                    {status === "drowsy" && "Phát hiện dấu hiệu buồn ngủ"}
                    {status === "danger" && "Cảnh báo: Tài xế rất buồn ngủ!"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Thống kê cảnh báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground">Tổng cảnh báo</span>
                  <span className="text-2xl font-bold text-primary">{warnings.total}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Buồn ngủ</span>
                  <span className="text-2xl font-bold text-yellow-600">{warnings.drowsy}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Nguy hiểm</span>
                  <span className="text-2xl font-bold text-red-600">{warnings.danger}</span>
                </div>

                <Button 
                  onClick={() => setWarnings({ total: 0, drowsy: 0, danger: 0 })}
                  variant="outline" 
                  className="w-full"
                >
                  Đặt lại thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  <strong className="text-foreground">Lưu ý:</strong> Đây là bản demo. Hệ thống thực tế sử dụng AI để phân tích chính xác các dấu hiệu buồn ngủ.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
