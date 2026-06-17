import { styles } from "@/assets/styles/auth.styles.js";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError("");

    // Start sign-up process using email and password provided
    try {
      if (emailAddress === "" || password === "" || firstName.trim() === "" || lastName.trim() === "") {
        setError("Please fill in all fields.");
        return;
      } else if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      await signUp.create({
        emailAddress,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      console.log("Sign up error: ", err.errors?.[0]);
      if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("Please enter a valid email address.");
      } else if (err.errors?.[0]?.code === "form_password_length_too_short") {
        setError("Password must be at least 8 characters long.");
      } else if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError("The password is too weak. Please choose a stronger password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        const response = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerk_id: signUpAttempt.createdUserId,
            email: emailAddress,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.error || "Failed to create user");
        }
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err.errors?.[0]);
      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("The verification code is incorrect.");
      } else if (err.errors?.[0]?.code === "verification_failed") {
        setError("Too many failed attempts. You have to try again with the same or another method.");
      } else {
        setError("An error occurred. Please try again.");
      }
    };
  }

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    setCode(fullCode);
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />

        {!pendingVerification && (
          <>
            <Text style={styles.title}>Create Account</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TextInput
                style={[styles.input, error && styles.errorInput, { flex: 1 }]}
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="#9A8478"
                onChangeText={setFirstName}
              />

              <TextInput
                style={[styles.input, error && styles.errorInput, { flex: 1 }]}
                value={lastName}
                placeholder="Last Name"
                placeholderTextColor="#9A8478"
                onChangeText={setLastName}
              />
            </View>

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholderTextColor="#9A8478"
              placeholder="Enter email"
              onChangeText={setEmailAddress}
            />

            {/* <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              autoCapitalize="none"
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry
              onChangeText={setPassword}
            /> */}

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, error && styles.errorInput]}
                value={password}
                autoCapitalize="none"
                placeholder="Enter password"
                placeholderTextColor="#9A8478"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={confirmPassword}
              autoCapitalize="none"
              placeholder="Confirm password"
              placeholderTextColor="#9A8478"
              secureTextEntry
              onChangeText={setConfirmPassword}
            /> */}

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, error && styles.errorInput]}
                value={confirmPassword}
                autoCapitalize="none"
                placeholder="Confirm password"
                placeholderTextColor="#9A8478"
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {pendingVerification && (
          <>
            <Text style={styles.title}>Verify your email</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  style={{
                    width: 50,
                    height: 60,
                    borderWidth: 1,
                    borderColor: error ? COLORS.expense : COLORS.border,
                    borderRadius: 12,
                    fontSize: 24,
                    backgroundColor: COLORS.white,
                  }}
                />
              ))}
            </View>

            <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
