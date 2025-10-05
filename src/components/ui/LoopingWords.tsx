import { MotiView, AnimatePresence, Text } from "moti";
import { useState, useEffect } from "react";
import { View } from "react-native";

export const LoopingWords = ({
    words,
    duration = 2000,
    style,
    textStyle
}: {
    words: string[];
    duration?: number;
    style?: any;
    textStyle?: any;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, duration);
        return () => clearInterval(timer);
    }, [words, duration]);

    return (
        <View style={{ overflow: 'hidden', height: 20, alignSelf: 'flex-' }}>
            <AnimatePresence exitBeforeEnter>
                <MotiView
                    key={words[currentIndex]}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -20 }}
                    transition={{ type: 'timing', duration: 500 }}
                    style={[{ width: 'auto', position: 'relative' }, style]} // <-- important
                >
                    <Text style={textStyle}>{words[currentIndex]}</Text>
                </MotiView>
            </AnimatePresence>
        </View>

    );
};









// ///////////// LoopingWordsAdvanced



