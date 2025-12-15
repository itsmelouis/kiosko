/**
 * Écran de veille - Page d'accueil
 * Affiche le logo et un bouton pour commencer la commande
 * Vidéo de fond en boucle avec overlay sombre
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { mediumImpact } from '@/services/hapticsService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Source vidéo
const videoSource = require('@/assets/videos/welcome.mp4');

export default function WelcomeScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const footerPulseAnim = useRef(new Animated.Value(1)).current;

  // Player vidéo avec lecture en boucle
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    // Animation de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animation pulse continue pour le bouton
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Animation pulse continue pour le footer (plus lent et subtil)
    const footerPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(footerPulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(footerPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    footerPulse.start();

    return () => {
      pulse.stop();
      footerPulse.stop();
    };
  }, [fadeAnim, pulseAnim, footerPulseAnim]);

  const handleStartOrder = () => {
    mediumImpact();
    router.push('/dine-mode');
  };

  return (
    <TouchableWithoutFeedback onPress={handleStartOrder}>
      <View style={styles.container}>
        {/* Vidéo de fond */}
        <VideoView
          player={player}
          style={styles.backgroundVideo}
          contentFit="cover"
          nativeControls={false}
        />
        
        {/* Overlay sombre */}
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={80} color={Colors.textLight} />
            </View>
            <Text style={styles.logoText}>KIOSKO</Text>
            <Text style={styles.tagline}>Commandez en toute simplicité</Text>
          </View>

          {/* Bouton Commander */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Button
              title="Commander"
              onPress={handleStartOrder}
              size="lg"
              icon="arrow-forward"
              iconPosition="right"
              style={styles.orderButton}
              textStyle={styles.orderButtonText}
            />
          </Animated.View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="restaurant-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.instructionText}>Choisissez vos plats</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="options-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.instructionText}>Personnalisez</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="card-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.instructionText}>Payez</Text>
            </View>
          </View>
        </Animated.View>

          {/* Footer avec animation pulse */}
          <Animated.Text 
            style={[
              styles.footer, 
              { transform: [{ scale: footerPulseAnim }] }
            ]}
          >
            Touchez l&apos;écran pour commencer
          </Animated.Text>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Filtre noir léger (40%)
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: FontSizes.lg,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  orderButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    minWidth: 280,
  },
  orderButtonText: {
    fontSize: FontSizes.xl,
  },
  instructionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
    gap: Spacing.xl,
  },
  instructionItem: {
    alignItems: 'center',
  },
  instructionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  instructionText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    textAlign: 'center',
    fontSize: FontSizes.md,
    color: Colors.textLight,
    paddingBottom: Spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
