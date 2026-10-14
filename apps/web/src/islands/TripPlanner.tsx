import { useState, useEffect } from 'react';

export interface TripItemState {
  id: string;
  day_index: number;
  position: number;
  kind: 'tempat' | 'makan' | 'transit' | 'catatan';
  title: string;
  highlight_id?: string | null;
  time_of_day?: 'pagi' | 'siang' | 'sore' | 'malam' | null;
  notes?: string | null;
}

export interface DestinationHighlight {
  id: string;
  name: string;
  kind: string;
  area: string;
  duration: string;
  best_time: string;
  note: string;
}

export interface TripPlannerProps {
  initialTrip?: {
    id?: string;
    title: string;
    destination: string;
    start_month?: number | null;
    days: number;
    version?: number;
    items?: TripItemState[];
  };
  destinations: Array<{
    slug: string;
    name: string;
    typical_days: { min: number; max: number };
    highlights: DestinationHighlight[];
  }>;
}

export default function TripPlanner({ initialTrip, destinations }: TripPlannerProps) {
  const [tripId, setTripId] = useState<string | null>(initialTrip?.id || null);
  const [title, setTitle] = useState(initialTrip?.title || 'Rencana Perjalanan Singgah');
  const [destinationSlug, setDestinationSlug] = useState(
    initialTrip?.destination || destinations[0]?.slug || 'labuan-bajo',
  );
  const [startMonth, setStartMonth] = useState<number>(
    initialTrip?.start_month || new Date().getMonth() + 1,
  );
  const [daysCount, setDaysCount] = useState<number>(initialTrip?.days || 4);
  const [items, setItems] = useState<TripItemState[]>(initialTrip?.items || []);
  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan di perangkat ini (lokal)');
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(initialTrip?.version || 1);
  const [selectedDayTarget, setSelectedDayTarget] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Ambil destinasi aktif
  const currentDest = destinations.find((d) => d.slug === destinationSlug) || destinations[0];

  // Inisialisasi item bawaan jika masih kosong
  useEffect(() => {
    if (items.length === 0 && currentDest?.highlights) {
      const defaultItems: TripItemState[] = [
        {
          id: 'item-1',
          day_index: 1,
          position: 0,
          kind: 'transit',
          title: `Tiba di ${currentDest.name}`,
          time_of_day: 'pagi',
          notes: 'Penyelesaian administrasi kedatangan dan sewa kendaraan.',
        },
      ];

      currentDest.highlights.slice(0, 3).forEach((h, idx) => {
        defaultItems.push({
          id: `item-init-${idx + 2}`,
          day_index: Math.min(idx + 1, daysCount),
          position: idx + 1,
          kind: (h.kind as any) || 'tempat',
          title: h.name,
          highlight_id: h.id,
          time_of_day: (h.best_time as any) || 'pagi',
          notes: h.note,
        });
      });

      setItems(defaultItems);
    }
  }, [destinationSlug]);

  // Simpan otomatis ke localStorage
  useEffect(() => {
    const dataToSave = {
      id: tripId,
      title,
      destination: destinationSlug,
      start_month: startMonth,
      days: daysCount,
      version,
      items,
      updated_at: Date.now(),
    };
    try {
      localStorage.setItem('singgah_active_trip', JSON.stringify(dataToSave));
      const timeStr = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSaveStatus(`Tersimpan lokal ${timeStr}`);
    } catch {
      // Abaikan bila storage penuh
    }
  }, [title, destinationSlug, startMonth, daysCount, items, version]);

  // Tambahkan item dari highlight ke hari yang dipilih
  const addHighlightItem = (h: DestinationHighlight) => {
    const dayItems = items.filter((it) => it.day_index === selectedDayTarget);
    const newItem: TripItemState = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      day_index: selectedDayTarget,
      position: dayItems.length,
      kind: (h.kind as any) || 'tempat',
      title: h.name,
      highlight_id: h.id,
      time_of_day: (h.best_time as any) || 'siang',
      notes: h.note,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Tambahkan item kustom
  const addCustomItem = (dayIndex: number) => {
    const dayItems = items.filter((it) => it.day_index === dayIndex);
    const newItem: TripItemState = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      day_index: dayIndex,
      position: dayItems.length,
      kind: 'catatan',
      title: 'Aktivitas baru',
      time_of_day: 'siang',
      notes: '',
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Pindahkan item ke atas
  const moveItemUp = (itemId: string, dayIndex: number) => {
    const dayItems = items
      .filter((it) => it.day_index === dayIndex)
      .sort((a, b) => a.position - b.position);
    const index = dayItems.findIndex((it) => it.id === itemId);
    if (index <= 0) return;

    const prevItem = dayItems[index - 1];
    const currItem = dayItems[index];

    const tempPos = prevItem.position;
    prevItem.position = currItem.position;
    currItem.position = tempPos;

    setItems([...items]);
  };

  // Pindahkan item ke bawah
  const moveItemDown = (itemId: string, dayIndex: number) => {
    const dayItems = items
      .filter((it) => it.day_index === dayIndex)
      .sort((a, b) => a.position - b.position);
    const index = dayItems.findIndex((it) => it.id === itemId);
    if (index >= dayItems.length - 1 || index === -1) return;

    const nextItem = dayItems[index + 1];
    const currItem = dayItems[index];

    const tempPos = nextItem.position;
    nextItem.position = currItem.position;
    currItem.position = tempPos;

    setItems([...items]);
  };

  // Hapus item
  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Update field item inline
  const updateItem = (itemId: string, field: keyof TripItemState, value: any) => {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)));
  };

  // Bagikan rencana (buat share link)
  const handleShare = async () => {
    try {
      setSaveStatus('Menyiapkan tautan...');
      const res = await fetch('/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          destination: destinationSlug,
          start_month: startMonth,
          days: daysCount,
          items,
        }),
      });

      if (res.ok) {
        const data: any = await res.json();
        const createdId = data.trip.id;
        setTripId(createdId);
        if (data.trip.version) setVersion(data.trip.version);

        const shareRes = await fetch(`/api/v1/trips/${createdId}/share`, { method: 'PUT' });
        if (shareRes.ok) {
          const shareData: any = await shareRes.json();
          setShareSlug(shareData.share_slug);
          navigator.clipboard.writeText(`${window.location.origin}/r/${shareData.share_slug}`);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3000);
          setSaveStatus('Tautan disalin ke clipboard');
          return;
        }
      }
    } catch {
      const randomSlug = Math.random().toString(36).substring(2, 10);
      setShareSlug(randomSlug);
      navigator.clipboard.writeText(`${window.location.origin}/r/${randomSlug}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      setSaveStatus('Tautan disalin (mode lokal)');
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* PANEL 1 (KIRI, 3 KOLOM): Pengaturan & Status */}
      <aside className="lg:col-span-3 bg-[#081822] p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div>
          <label className="text-[11px] font-sans font-semibold text-text-3 uppercase tracking-wider block mb-1.5">
            Judul Rencana
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#041017] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-sans font-semibold text-white outline-none focus:border-mint"
            maxLength={80}
          />
        </div>

        <div>
          <label className="text-[11px] font-sans font-semibold text-text-3 uppercase tracking-wider block mb-1.5">
            Destinasi
          </label>
          <select
            value={destinationSlug}
            onChange={(e) => setDestinationSlug(e.target.value)}
            className="w-full bg-[#041017] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-sans text-white outline-none focus:border-mint cursor-pointer"
          >
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug} className="bg-[#081822] text-white">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-sans font-semibold text-text-3 uppercase tracking-wider block mb-1.5">
              Bulan
            </label>
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className="w-full bg-[#041017] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-sans text-white outline-none focus:border-mint cursor-pointer"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx + 1} className="bg-[#081822] text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-sans font-semibold text-text-3 uppercase tracking-wider block mb-1.5">
              Lama Hari
            </label>
            <div className="flex items-center gap-1 bg-[#041017] border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setDaysCount((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg text-white font-bold hover:bg-white/20 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center font-sans font-bold text-xs text-white">
                {daysCount}
              </span>
              <button
                type="button"
                onClick={() => setDaysCount((prev) => Math.min(14, prev + 1))}
                className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg text-white font-bold hover:bg-white/20 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/8">
          <span className="text-[10px] text-text-3 block uppercase tracking-wider font-semibold mb-1">Status Penyimpanan</span>
          <span className="text-xs font-medium text-mint block">{saveStatus}</span>
        </div>

        <div className="space-y-2.5 pt-2">
          <button type="button" onClick={handleShare} className="btn-primary w-full text-xs h-10">
            {isCopied ? 'Tautan Disalin!' : 'Bagikan Rencana →'}
          </button>
          {shareSlug && (
            <a
              href={`/r/${shareSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-mint underline block text-center mt-1 font-semibold"
            >
              Lihat publik: /r/{shareSlug}
            </a>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-glass w-full text-xs h-10"
          >
            Cetak rencana (PDF/A4)
          </button>
        </div>
      </aside>

      {/* PANEL 2 (TENGAH, 6 KOLOM): Daftar Hari & Timeline */}
      <main className="lg:col-span-6 space-y-6">
        {Array.from({ length: daysCount }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayItems = items
            .filter((it) => it.day_index === dayNum)
            .sort((a, b) => a.position - b.position);

          const isHeavy = dayItems.length > 3;

          return (
            <section
              key={dayNum}
              className="bg-[#081822] rounded-3xl border border-white/10 p-5 md:p-6 shadow-xl"
              aria-labelledby={`day-heading-${dayNum}`}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <h2 id={`day-heading-${dayNum}`} className="font-serif text-2xl text-white">
                    Hari {dayNum}
                  </h2>
                  <span className="text-xs text-mint font-semibold bg-mint/10 border border-mint/20 px-2.5 py-0.5 rounded-full font-sans">
                    {dayItems.length} agenda
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addCustomItem(dayNum)}
                  className="text-xs text-mint hover:underline font-semibold"
                >
                  + Tambah item
                </button>
              </div>

              {/* Peringatan Hari Padat */}
              {isHeavy && (
                <div className="mb-4 p-3 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-sans">
                  Hari ini cukup padat ({dayItems.length} aktivitas). Disarankan memindahkan satu agenda agar tetap rileks.
                </div>
              )}

              {/* List Aktivitas Harian */}
              {dayItems.length === 0 ? (
                <p className="text-xs text-text-3 font-sans py-4 text-center italic">
                  Belum ada aktivitas di hari ini. Pilih dari daftar highlight di sebelah kanan.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-black/30 rounded-2xl border border-white/8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between hover:border-mint/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 flex-1 w-full">
                        {/* Tombol Naik / Turun */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            title="Pindah naik"
                            onClick={() => moveItemUp(item.id, dayNum)}
                            className="text-[9px] w-5 h-4 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            title="Pindah turun"
                            onClick={() => moveItemDown(item.id, dayNum)}
                            className="text-[9px] w-5 h-4 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Waktu Hari */}
                        <select
                          value={item.time_of_day || 'pagi'}
                          onChange={(e) => updateItem(item.id, 'time_of_day', e.target.value)}
                          className="bg-[#041017] border border-white/10 text-[11px] rounded-lg px-2 py-1 text-mint font-semibold cursor-pointer outline-none"
                        >
                          <option value="pagi" className="bg-[#081822] text-white">Pagi</option>
                          <option value="siang" className="bg-[#081822] text-white">Siang</option>
                          <option value="sore" className="bg-[#081822] text-white">Sore</option>
                          <option value="malam" className="bg-[#081822] text-white">Malam</option>
                        </select>

                        {/* Judul Input */}
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                          className="flex-1 bg-transparent text-sm font-sans font-medium text-white border-b border-transparent hover:border-white/20 focus:border-mint outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-text-3 hover:text-red-400 p-1.5 rounded transition-colors flex items-center justify-center"
                          title="Hapus aktivitas"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="4" x2="12" y2="12"></line>
                            <line x1="12" y1="4" x2="4" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* PANEL 3 (KANAN, 3 KOLOM): Highlight Rekomendasi */}
      <aside className="lg:col-span-3 bg-[#081822] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div>
          <h3 className="font-serif text-xl text-white mb-1">Yang layak disinggahi</h3>
          <p className="text-xs font-sans text-text-3">
            Highlight terbaik {currentDest.name}
          </p>
        </div>

        <div className="text-xs font-sans">
          <label className="text-text-3 block mb-1.5 font-semibold">Tambahkan ke Hari:</label>
          <select
            value={selectedDayTarget}
            onChange={(e) => setSelectedDayTarget(Number(e.target.value))}
            className="w-full bg-[#041017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
          >
            {Array.from({ length: daysCount }).map((_, i) => (
              <option key={i + 1} value={i + 1} className="bg-[#081822] text-white">
                Hari {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-white/8 pt-2">
          {currentDest.highlights?.map((h) => (
            <div key={h.id} className="py-3.5 first:pt-0 last:pb-0">
              <span className="font-sans font-semibold text-xs text-white block mb-1">
                {h.name}
              </span>
              <p className="text-[11px] text-text-2 leading-relaxed line-clamp-2 mb-2">{h.note}</p>
              <button
                type="button"
                onClick={() => addHighlightItem(h)}
                className="text-xs text-mint hover:underline font-semibold"
              >
                + Tambah ke Hari {selectedDayTarget}
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
