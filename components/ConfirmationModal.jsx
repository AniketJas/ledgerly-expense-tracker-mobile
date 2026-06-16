import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";

const ConfirmationModal = ({
  visible,
  title,
  message,
  icon = "help-circle-outline",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = COLORS.primary,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.55)",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "90%",
            maxWidth: 400,
            backgroundColor: COLORS.background,
            borderRadius: 24,
            padding: 24,
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Ionicons
              name={icon}
              size={56}
              color={confirmColor}
            />

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
                textAlign: "center",
                color: COLORS.textLight,
                marginTop: 10,
                lineHeight: 22,
              }}
            >
              {message}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 28,
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: "center",
              }}
              onPress={onCancel}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontWeight: "600",
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: confirmColor,
                alignItems: "center",
              }}
              onPress={onConfirm}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "600",
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;