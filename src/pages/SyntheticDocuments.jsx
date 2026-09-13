import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Images } from "lucide-react";
import AddSyntheticDocForm from "@/components/synthetic/AddSyntheticDocForm";

export default function SyntheticDocuments() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    base44.entities.SyntheticDocument.list("-created_date", 100).then(setDocs);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 flex items-center justify-center">
          <Images className="w-5 h-5 text-[#0f766e]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Reference Library</h1>
          <p className="text-sm text-slate-400">Synthetic reference documents used for verification context.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
          {docs === null ? (
            <p className="text-sm text-slate-400 col-span-2">Loading library...</p>
          ) : docs.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
              No reference documents yet. Add one to get started.
            </div>
          ) : (
            docs.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <Image src={d.image_url} alt={d.name} className="w-full h-32" fittingType="fill" />
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{d.document_type.replace("_", " ")}</p>
                  {d.notes && <p className="text-xs text-slate-500 mt-1">{d.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
        <AddSyntheticDocForm onAdded={(doc) => setDocs((prev) => [doc, ...(prev || [])])} />
      </div>
    </div>
  );
}