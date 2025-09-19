import React, { useMemo, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import Header from '../components/Header';
import SegmentedTabs from '../components/SegmentedTabs';
import EntryList from '../components/EntryList';
import AddEntrySheet from '../components/AddEntrySheet';
import { useBudget } from '../context/BudgetContext';
import Fonts from '../constants/fonts';

import {
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// 👇 Ad Unit IDs
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-5350658561696692/9475243069';
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5350658561696692/3182680347';

// Function to create a new RewardedAd instance
const createRewardedAd = () => {
  return RewardedAd.createForAdRequest(rewardedAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
};

export default function HomeScreen() {
  const { entries, addEntry } = useBudget();
  const [tab, setTab] = useState('Expenses');
  const [open, setOpen] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [rewarded, setRewarded] = useState(createRewardedAd());

  // Filter entries by active tab
  const filtered = useMemo(() => {
    if (tab === 'Expenses') return entries.filter((e) => e.type === 'expense');
    if (tab === 'Income') return entries.filter((e) => e.type === 'income');
    return entries.filter((e) => e.type === 'loan');
  }, [entries, tab]);

  // Load Rewarded Ad
  useEffect(() => {
    const loadAd = () => {
      // Reset adLoaded
      setAdLoaded(false);

      const newRewarded = createRewardedAd();
      setRewarded(newRewarded);

      const unsubscribeLoaded = newRewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => setAdLoaded(true)
      );

      const unsubscribeEarned = newRewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('User earned reward: ', reward);
          // addEntry({
          //   id: Date.now().toString(),
          //   title: 'Bonus Coins',
          //   amount: reward.amount || 10, // Add actual reward from AdMob
          //   type: 'income',
          //   timestamp: new Date().toISOString(),
          // });
        }
      );

      // Load the ad
      newRewarded.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    };

    loadAd();
  }, [addEntry]);
  

  // Show Rewarded Ad
  const showRewardedAd = () => {
    if (adLoaded && rewarded) {
      rewarded.show();
      // Reload ad immediately for next time
      const newRewarded = createRewardedAd();
      setRewarded(newRewarded);

      newRewarded.addAdEventListener(RewardedAdEventType.LOADED, () => setAdLoaded(true));
      newRewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward: ', reward);
        // addEntry({
        //   id: Date.now().toString(),
        //   title: 'Bonus Coins',
        //   amount: reward.amount || 10,
        //   type: 'income',
        //   timestamp: new Date().toISOString(),
        // });
      });
      newRewarded.load();
      setAdLoaded(false);
    } else {
      console.log('Rewarded Ad not ready yet');
    }
  };

  // Handle add entry with safe timestamp
  const handleAddEntry = (entry) => {
    addEntry({
      ...entry,
      id: entry.id || Date.now().toString(),
      timestamp: entry.timestamp || new Date().toISOString(),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <SegmentedTabs value={tab} onChange={setTab} />
      <EntryList data={filtered} type={tab} />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      {/* Rewarded Ad Button */}
      <View style={{ position: 'absolute', left: 16, bottom: 120 }}>
        <Button
          title="🎥 Watch Ad to Earn Bonus"
          onPress={showRewardedAd}
          disabled={!adLoaded}
        />
      </View>

      {/* Banner Ad at the bottom */}
      <View style={{ alignItems: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>

      {/* Bottom Sheet for Adding Entries */}
      <AddEntrySheet
        visible={open}
        onClose={() => setOpen(false)}
        mode={tab}
        onSubmit={handleAddEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0b5fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabPlus: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
    marginTop: -2,
    fontFamily: Fonts[600],
  },
});
