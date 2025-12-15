/**
 * Écran de scan QR - Scanner la carte fidélité
 * Utilise la caméra pour scanner le QR code
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { errorFeedback, getUserByQR, successFeedback } from '@/services';
import { useCartStore } from '@/stores/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const router = useRouter();
  const setUser = useCartStore((state) => state.setUser);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.push('/menu');
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      // Récupère l'utilisateur via le QR code de fidélité
      const user = await getUserByQR(data);
      
      if (user) {
        successFeedback();
        setUser(user);
        
        Alert.alert(
          'Bienvenue !',
          `Bonjour ${user.firstname} ! Vous avez ${user.points} points fidélité.`,
          [
            {
              text: 'Continuer',
              onPress: () => router.push('/menu'),
            },
          ]
        );
      } else {
        errorFeedback();
        Alert.alert(
          'Carte non reconnue',
          'Cette carte fidélité n\'est pas reconnue. Veuillez réessayer.',
          [
            {
              text: 'Réessayer',
              onPress: () => setScanned(false),
            },
            {
              text: 'Continuer sans compte',
              onPress: () => router.push('/menu'),
            },
          ]
        );
      }
    } catch {
      errorFeedback();
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button
            title=""
            onPress={handleBack}
            variant="ghost"
            icon="arrow-back"
          />
        </View>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.permissionTitle}>Accès à la caméra requis</Text>
          <Text style={styles.permissionText}>
            Pour scanner votre carte fidélité, nous avons besoin d&apos;accéder à votre caméra.
          </Text>
          <Button
            title="Autoriser la caméra"
            onPress={requestPermission}
            size="lg"
            icon="camera"
            style={styles.permissionButton}
          />
          <Button
            title="Continuer sans scanner"
            onPress={handleSkip}
            variant="outline"
            size="md"
            style={styles.skipButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={handleBack}
          variant="ghost"
          icon="arrow-back"
        />
        <Text style={styles.headerTitle}>Scanner votre carte</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Ionicons name="qr-code" size={24} color={Colors.primary} />
        <Text style={styles.instructionsText}>
          Placez le QR code de votre carte dans le cadre
        </Text>
      </View>

      {/* Skip button */}
      <View style={styles.footer}>
        <Button
          title="Continuer sans carte fidélité"
          onPress={handleSkip}
          variant="ghost"
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.textLight,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  instructionsText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    marginBottom: Spacing.md,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
});
