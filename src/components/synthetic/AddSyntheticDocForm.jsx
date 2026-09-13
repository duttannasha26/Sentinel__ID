import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { uploadImage } from "@/lib/fileUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, Plus } from "lucide-react";

const DOC_TYPES = ["passport", "visa", "national_id", "driving_license", "permit"];

export default function AddSyntheticDocForm({ onAdded }) {
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("passport");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      setImageUrl(await uploadImage(file));
    } catch (error) {
      setUploadError(error.message || "The image could not be uploaded.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async () => {
    setSaving(true);
    const created = await base44.entities.SyntheticDocument.create({
      name, document_type: documentType, image_url: imageUrl, notes,
    });
    setSaving(false);
    setName(""); setNotes(""); setImageUrl(null);
    onAdded(created);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <p className="text-sm font-medium text-slate-700">Add Reference Document</p>
      <Input placeholder="Label / name" value={name} onChange={(e) => setName(e.target.value)} />
      <Select value={documentType} onValueChange={setDocumentType}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}
        </SelectContent>
      </Select>
      <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none" />

      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
      ) : (
        <label className="flex items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0f766e] cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Upload className="w-4 h-4 text-slate-400" />}
          <span className="text-sm text-slate-500">Upload image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      )}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <Button disabled={!name || !imageUrl || saving} onClick={submit} className="w-full gap-2 bg-[#0f766e] hover:bg-[#0b5a54]">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Add to Library
      </Button>
    </div>
  );
}