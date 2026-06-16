// components/CustomModal.jsx

import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";

const CustomModal = ({
  visible,
  title,
  message,
  type = "success", // success | error | warning
  buttonText = "OK",
  onClose,
}) => {
  const iconName =
    type === "success"
      ? "checkmark-circle"
      : type === "error"
        ? "close-circle"
        : "alert-circle";

  const iconColor =
    type === "success"
      ? COLORS.income
      : type === "error"
        ? COLORS.expense
        : COLORS.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.55)",
          padding: 24,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: "90%",
            maxWidth: 400,
            backgroundColor: COLORS.background,
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              alignItems: "center",
              paddingTop: 28,
              paddingHorizontal: 24,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  type === "success"
                    ? `${COLORS.income}20`
                    : type === "error"
                      ? `${COLORS.expense}20`
                      : `${COLORS.primary}20`,
              }}
            >
              <Ionicons
                name={iconName}
                size={48}
                color={iconColor}
              />
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: COLORS.text,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: COLORS.textLight,
                textAlign: "center",
                marginTop: 10,
                lineHeight: 22,
              }}
            >
              {message}
            </Text>
          </View>

          {/* Footer */}
          <View
            style={{
              padding: 20,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 16,
                paddingVertical: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;