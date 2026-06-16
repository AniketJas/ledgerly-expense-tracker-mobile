import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { styles } from "../assets/styles/home.styles";
import ConfirmationModal from "../components/ConfirmationModal";
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

      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        icon="log-out-outline"
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor={COLORS.expense}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};