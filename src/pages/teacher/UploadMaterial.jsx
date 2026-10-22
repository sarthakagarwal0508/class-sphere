import { useState, useEffect } from 'react';
import { 
  Upload, FileText, Trash2, Download, AlertCircle, 
  CheckCircle2, HardDrive, FolderOpen
} from 'lucide-react';
import { fetchMyClassrooms } from '../../services/classroomService';
import {
  deleteMaterial,
  downloadMaterial,
  fetchClassroomMaterials,
  uploadMaterial,
} from '../../services/materialService';

export default function UploadMaterial() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [materials, setMaterials] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch classrooms for the dropdown
  useEffect(() => {
    fetchMyClassrooms()
      .then((classList) => {
        setClassrooms(classList);
        if (classList.length > 0) {
          setSelectedClassId(classList[0]._id || classList[0].id);
        } else {
          setFetchLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load classrooms:', err);
        setErrorMsg(err.message || 'Failed to load classrooms.');
        setFetchLoading(false);
      });
  }, []);

  // 2. Fetch materials whenever selected classroom changes
  useEffect(() => {
    if (!selectedClassId) return;

    fetchClassroomMaterials(selectedClassId)
      .then((data) => {
        setMaterials(Array.isArray(data) ? data : data.materials ?? []);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Failed to fetch classroom materials.');
        setMaterials([]);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [selectedClassId]);

  // 3. Handle File Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedClassId) {
      setErrorMsg('Please select a classroom first.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a title for the document.');
      return;
    }
    if (!file) {
      setErrorMsg('Please select a PDF file to upload.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit.');
      return;
    }

    setLoading(true);
    try {
      const newMaterial = await uploadMaterial(selectedClassId, {
        file,
        title: title.trim(),
        description: description.trim(),
      });

      setSuccessMsg('PDF uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);

      // Prepend newly uploaded material to list
      setMaterials((prev) => [newMaterial, ...prev]);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Failed to upload document.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Delete Material
  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await deleteMaterial(materialId);
      setMaterials((prev) => prev.filter((m) => (m._id || m.id) !== materialId));
      setSuccessMsg('Resource removed.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete resource.');
    }
  };

  const handleDownload = async (material) => {
    try {
      await downloadMaterial(
        material._id || material.id,
        `${material.title || 'class-notes'}.pdf`
      );
    } catch (err) {
      setErrorMsg(err.message || 'Failed to download resource.');
    }
  };

  return (
    <div className="space-y-6 dashboard-stagger max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
          Upload Study Material
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Share lecture slides, reference PDFs, and notes with your enrolled students.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (2 Columns) */}
        <form
          onSubmit={handleUpload}
          className="lg:col-span-2 bg-white dark:bg-[#121214] border border-[#e5e7eb] dark:border-[#1f1f23] rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Resource Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Classroom <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setFetchLoading(true);
                setErrorMsg('');
              }}
              className="w-full bg-[#f8f9fa] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#fde047]"
            >
              {classrooms.length === 0 ? (
                <option value="">No classrooms available. Create one first.</option>
              ) : (
                classrooms.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} ({c.classCode || c.code})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unit 3: Graph Traversal & Dijkstra's Algorithm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f8f9fa] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#fde047]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Topic (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Recommended reading before Friday's lab session."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#f8f9fa] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#fde047]"
            />
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Upload PDF File (Max 10 MB) <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-[#fde047] transition bg-[#f8f9fa] dark:bg-slate-800/30">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-amber-500"
              >
                {file ? file.name : 'Click to select PDF or drag and drop'}
              </label>
              <p className="text-[11px] text-slate-400 mt-1">PDF documents only &bull; Up to 10 MB</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedClassId}
            className="px-6 py-3 rounded-xl bg-[#181829] hover:bg-black text-white text-xs font-bold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading PDF...' : 'Upload Resource'}
          </button>
        </form>

        {/* Sidebar Info & Storage */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Cloud Storage Quota
              </h3>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Used for PDFs</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{materials.length} files</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-[#fde047] rounded-full" style={{ width: `${Math.min(materials.length * 5, 100)}%` }} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Files uploaded here are instantly visible to students enrolled in the selected cohort.
            </p>
          </div>
        </div>
      </div>

      {/* Shared Documents Library */}
      <div className="rounded-2xl border border-[#e5e7eb] dark:border-[#1f1f23] bg-white dark:bg-[#121214] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Shared Documents ({materials.length})
          </h2>
        </div>

        {fetchLoading ? (
          <p className="text-xs text-slate-400 py-4 text-center">Loading resources...</p>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500">No resources uploaded for this classroom yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {materials.map((m) => {
              const id = m._id || m.id;
              return (
                <div key={id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-amber-800 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {m.description || 'Lecture Notes'} &bull; PDF
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(m)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition"
                      title="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}