import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { db } from './config';
import type { Tenant, Webinar, WebinarFormData } from '@/types';

// Collection references
const tenantsCollection = collection(db, 'tenants');
const webinarsCollection = collection(db, 'webinars');

// Tenant operations
export async function getTenant(uid: string): Promise<Tenant | null> {
  const docRef = doc(tenantsCollection, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as Tenant;
  }
  return null;
}

export async function getAllTenants(): Promise<Tenant[]> {
  const q = query(tenantsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Tenant));
}

export async function createTenant(
  uid: string,
  data: { email: string; companyName: string }
): Promise<void> {
  const docRef = doc(tenantsCollection, uid);
  await updateDoc(docRef, {
    ...data,
    status: 'active',
    createdAt: serverTimestamp(),
  }).catch(async () => {
    // Document doesn't exist, create it
    const { setDoc } = await import('firebase/firestore');
    await setDoc(docRef, {
      ...data,
      status: 'active',
      createdAt: serverTimestamp(),
    });
  });
}

export async function updateTenantStatus(
  uid: string,
  status: 'active' | 'suspended'
): Promise<void> {
  const docRef = doc(tenantsCollection, uid);
  await updateDoc(docRef, { status });
}

// Webinar operations
export async function getWebinar(id: string): Promise<Webinar | null> {
  const docRef = doc(webinarsCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Webinar;
  }
  return null;
}

export async function getWebinarsByTenant(tenantId: string): Promise<Webinar[]> {
  const q = query(
    webinarsCollection,
    where('tenantId', '==', tenantId)
  );
  const snapshot = await getDocs(q);
  const webinars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Webinar));
  // Sort by createdAt client-side to avoid needing composite index
  return webinars.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}

export async function createWebinar(
  tenantId: string,
  formData: WebinarFormData
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webinarData: Record<string, any> = {
    tenantId,
    title: formData.title,
    youtubeId: formData.youtubeId,
    durationSec: formData.durationSec,
    scheduleTime: formData.scheduleTime,
    thumbnailUrl: formData.thumbnailUrl,
    loopProtection: formData.loopProtection,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (formData.ctaEnabled && formData.ctaShowTimeSec && formData.ctaLabel && formData.ctaUrl) {
    webinarData.ctaSettings = {
      showTimeSec: formData.ctaShowTimeSec,
      label: formData.ctaLabel,
      url: formData.ctaUrl,
    };
  }

  const docRef = await addDoc(webinarsCollection, webinarData);
  return docRef.id;
}

export async function updateWebinar(
  id: string,
  formData: WebinarFormData
): Promise<void> {
  const docRef = doc(webinarsCollection, id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {
    title: formData.title,
    youtubeId: formData.youtubeId,
    durationSec: formData.durationSec,
    scheduleTime: formData.scheduleTime,
    thumbnailUrl: formData.thumbnailUrl,
    loopProtection: formData.loopProtection,
    updatedAt: serverTimestamp(),
  };

  if (formData.ctaEnabled && formData.ctaShowTimeSec && formData.ctaLabel && formData.ctaUrl) {
    updateData.ctaSettings = {
      showTimeSec: formData.ctaShowTimeSec,
      label: formData.ctaLabel,
      url: formData.ctaUrl,
    };
  } else {
    updateData.ctaSettings = null;
  }

  await updateDoc(docRef, updateData);
}

export async function deleteWebinar(id: string): Promise<void> {
  const docRef = doc(webinarsCollection, id);
  await deleteDoc(docRef);
}
