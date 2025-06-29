import { NextResponse } from 'next/server';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'leads'));
    const leads = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(leads);
  } catch (error) {
    console.error('GET error:', error);
    return new NextResponse('Failed to fetch leads', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const docRef = await addDoc(collection(db, 'leads'), data);
    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('POST error:', error);
    return new NextResponse('Failed to add lead', { status: 500 });
  }
}
