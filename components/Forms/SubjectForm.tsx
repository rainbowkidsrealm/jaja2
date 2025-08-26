"use client";
import React, { useEffect, useState } from "react";
import {
  createSubjectApi,
  getClassesApi,
  getTeachersApi,
  updateSubjectApi,
} from "@/lib/api";
import { Subject } from "@/types/";
import { Class } from "@/types/";
import { Teacher } from "@/types/";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BookOpen, School, User, Save } from "lucide-react";
import { toast } from "sonner";

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: Partial<Subject>) => void;
  onCancel: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    code: subject?.code || "",
    description: subject?.description || "",
    classId: subject?.classId ?? "",
    teacherId: subject?.teacherId ?? "",
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClasses = await getClassesApi();
        setClasses(resClasses);
        const resTeachers = await getTeachersApi();
        setTeachers(resTeachers);
      } catch (err) {
        setError("Failed to fetch classes or teachers.");
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.teacherId) {
      setError("Class and Teacher are required");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        classId: Number(formData.classId),
        teacherId: Number(formData.teacherId),
      };

      let newSubject: Subject;
      if (subject) {
        await updateSubjectApi(subject.id, data);
        newSubject = { ...subject, ...data };
        toast.success("Subject updated successfully!");
      } else {
        newSubject = await createSubjectApi(data as any);
        toast.success("Subject created successfully!");
      }
      onSubmit(newSubject); // Pass the new or updated subject to the parent
    } catch (err: any) {
      setError(err.message || "Failed to save subject");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white shadow-md rounded-lg">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <BookOpen className="h-6 w-6 text-blue-600" />
          {subject ? "Edit Subject" : "Add New Subject"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Subject Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter subject name"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-gray-700">
              Subject Code
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="Enter subject code"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classId" className="text-sm font-medium text-gray-700">
              Class *
            </Label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                id="classId"
                value={formData.classId}
                onChange={(e) => handleChange("classId", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacherId" className="text-sm font-medium text-gray-700">
              Teacher *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                id="teacherId"
                value={formData.teacherId}
                onChange={(e) => handleChange("teacherId", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter subject description"
            className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <Separator className="bg-gray-200" />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : subject ? "Update Subject" : "Create Subject"}
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}