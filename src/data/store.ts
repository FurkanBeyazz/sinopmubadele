export interface Memory {
    id: string;
    title: string;
    author: string;
    date: string;
    excerpt: string;
    image: string;
}

export interface GalleryItem {
    id: string;
    url: string;
    title: string;
    span: string;
}

const INITIAL_MEMORIES: Memory[] = [
    {
        id: '1',
        title: "Selanik'ten Sinop'a: Bir Yolculuk",
        author: "Mehmet Şahin",
        date: "1923",
        excerpt: "Gemi limandan ayrılırken arkamızda bıraktığımız zeytinliklere son kez baktık. Yeni bir hayat, bilinmez bir gelecek...",
        image: "https://images.unsplash.com/photo-1599140849279-1014532882fe?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: '2',
        title: "Mübadele ve Kültürel Miras",
        author: "Dr. Ayşe Yılmaz",
        date: "Aralık 2023",
        excerpt: "Sinop'un sokaklarında balkan esintilerini hissetmek mümkün. Mimariden müziğe her yerde balkan kökenli izler var.",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: '3',
        title: "Geleneksel Balkan Mutfağı",
        author: "Fatma Teyze",
        date: "Ocak 2024",
        excerpt: "Balkanlardan getirdiğimiz tariflerin en başında pita ve ajvar gelir. Bu lezzetler bizim bağlarımızı diri tutuyor.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
    }
];

const INITIAL_GALLERY: GalleryItem[] = [
    { id: '1', url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=800", title: "Eski Sinop Limanı", span: "col-span-2 row-span-2" },
    { id: '2', url: "https://images.unsplash.com/photo-1599140849279-1014532882fe?auto=format&fit=crop&q=80&w=600", title: "Mübadele Belgeleri", span: "col-span-1 row-span-1" },
    { id: '3', url: "https://images.unsplash.com/photo-1528154183222-38379ac7e90b?auto=format&fit=crop&q=80&w=600", title: "Geleneksel Kıyafetler", span: "col-span-1 row-span-1" },
    { id: '4', url: "https://images.unsplash.com/photo-1582298538104-fe2e74efd6b5?auto=format&fit=crop&q=80&w=800", title: "Balkan Sokakları", span: "col-span-1 row-span-2" },
    { id: '5', url: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800", title: "Gemi Yolculuğu", span: "col-span-1 row-span-1" },
];

const isBrowser = typeof window !== 'undefined';

export const getMemories = (): Memory[] => {
    if (!isBrowser) return INITIAL_MEMORIES;
    const data = localStorage.getItem('memories');
    if (!data) {
        localStorage.setItem('memories', JSON.stringify(INITIAL_MEMORIES));
        return INITIAL_MEMORIES;
    }
    return JSON.parse(data);
};

export const saveMemory = (memory: Memory) => {
    if (!isBrowser) return;
    const memories = getMemories();
    const index = memories.findIndex(m => m.id === memory.id);
    if (index >= 0) {
        memories[index] = memory;
    } else {
        memories.push(memory);
    }
    localStorage.setItem('memories', JSON.stringify(memories));
};

export const deleteMemory = (id: string) => {
    if (!isBrowser) return;
    const memories = getMemories().filter(m => m.id !== id);
    localStorage.setItem('memories', JSON.stringify(memories));
};

export const getGallery = (): GalleryItem[] => {
    if (!isBrowser) return INITIAL_GALLERY;
    const data = localStorage.getItem('gallery');
    if (!data) {
        localStorage.setItem('gallery', JSON.stringify(INITIAL_GALLERY));
        return INITIAL_GALLERY;
    }
    return JSON.parse(data);
};

export const saveGalleryItem = (item: GalleryItem) => {
    if (!isBrowser) return;
    const gallery = getGallery();
    gallery.push(item);
    localStorage.setItem('gallery', JSON.stringify(gallery));
};

export const deleteGalleryItem = (id: string) => {
    if (!isBrowser) return;
    const gallery = getGallery().filter(item => item.id !== id);
    localStorage.setItem('gallery', JSON.stringify(gallery));
};
