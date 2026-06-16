import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSignOut = async () => {
    setShowLogoutModal(false);
    await signOut();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutModal(true)}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={COLORS.text}
        />
      </TouchableOpacity>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowLogoutModal(false)}
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
                name="log-out-outline"
                size={56}
                color={COLORS.expense}
              />

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: COLORS.text,
                  marginTop: 16,
                }}
              >
                Logout
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.textLight,
                  marginTop: 10,
                  lineHeight: 22,
                }}
              >
                Are you sure you want to logout?
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
                  borderColor: COLORS.border || "#E5E7EB",
                  alignItems: "center",
                }}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: COLORS.expense,
                  alignItems: "center",
                }}
                onPress={handleSignOut}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontWeight: "600",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};