import React, { useState, useRef, ReactElement, cloneElement } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
import { useTheme } from '@/src/context/ThemeContext';

interface TooltipProps {
  text: string; // Tooltip message
  children: ReactElement; // Icon or any clickable component
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<View>(null);

  const showTooltip = () => {
    if (!triggerRef.current) return;

    const nodeHandle = findNodeHandle(triggerRef.current);

    if (nodeHandle) {
      // ✅ Proper position calculation
      UIManager.measure(nodeHandle, (_x, _y, width, height, pageX, pageY) => {
        const tooltipTop = pageY - 60; // tooltip above the trigger
        const tooltipLeft = pageX + width / 2 - 80; // center align
        setPosition({ top: tooltipTop, left: tooltipLeft });
        setVisible(true);
      });
    }
  };

  const hideTooltip = () => setVisible(false);

  // ✅ Wrap children with cloneElement safely
  const triggerWithProps = cloneElement(children, {
    ref: triggerRef,
    onPress: () => {
      showTooltip();
      if (children.props.onPress) {
        children.props.onPress(); // preserve existing onPress
      }
    },
  });

  return (
    <>
      {triggerWithProps}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        {/* Click anywhere to close */}
        <Pressable style={tw`flex-1`} onPress={hideTooltip}>
          <View
            style={[
              tw`absolute p-3 rounded-lg shadow-xl`,
              {
                backgroundColor: theme.colors.card,
                top: position.top,
                left: position.left,
                width: 160,
                zIndex: 9999,
              },
            ]}
          >
            <Text
              style={[
                tw`text-center text-xs`,
                { color: theme.colors.text },
              ]}
            >
              {text}
            </Text>

            {/* Arrow under tooltip */}
            <View
              style={[
                tw`absolute -bottom-2 self-center w-0 h-0 border-l-8 border-r-8 border-t-8`,
                {
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: theme.colors.card,
                },
              ]}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
