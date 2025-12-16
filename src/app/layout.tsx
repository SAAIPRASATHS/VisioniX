import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { LearningProvider } from "@/context/LearningContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "VisioniX - AI-Powered Learning Assistant",
    description: "Upload documents and get AI-powered summaries, tutorials, and video content. Transform your learning with Gemini AI.",
    keywords: ["learning", "AI", "education", "Gemini", "summarization", "video generation"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-background antialiased">
                <AuthProvider>
                    <LearningProvider>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-1">
                                {children}
                            </main>
                            <footer className="py-6 border-t border-border">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <p className="text-center text-sm text-muted-foreground">
                                        Powered by{" "}
                                        <span className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            Google Gemini AI
                                        </span>
                                        {" "}• VisioniX
                                    </p>
                                </div>
                            </footer>
                        </div>
                    </LearningProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

