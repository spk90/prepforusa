import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React from "react";

interface Experience {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: Date;
  visaType: string;
  status: string;
  likes: number;
  comments: number;
  isAdminPost: boolean;
  attempts: number;
  changesAfterRejection?: string;
}

const MAX_PREVIEW_LENGTH = 400;
const MAX_PREVIEW_LINES = 6;
const POSTS_PER_PAGE = 5;

function formatExperienceContent(content: string) {
  // Bold key labels and replace newlines with <br />
  const labelRegex =
    /^(Consulate:|Time:|Course :|University:|Vo:-|Vo:|Me:|Status:)/gim;
  return content
    .replace(labelRegex, (match) => `<strong>${match}</strong>`) // bold labels
    .replace(/\n/g, "<br />");
}

const VisaExperience = () => {
  const { currentUser } = useAuth();
  const [newExperience, setNewExperience] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedVisaType, setSelectedVisaType] = useState("F1");
  const [adminTitle, setAdminTitle] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [changesAfterRejection, setChangesAfterRejection] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    // Add Google AdSense script only once and only when there is content
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId) && experiences.length > 0) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1446474252906589";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, [experiences.length]); // Only re-run when experiences array changes

  const fetchExperiences = async () => {
    try {
      const experiencesRef = collection(db, "visa_experiences");
      const q = query(experiencesRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedExperiences = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Experience[];

      setExperiences(fetchedExperiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExperience.trim() || !currentUser) return;

    try {
      const experiencesRef = collection(db, "visa_experiences");
      const newExperienceObj = {
        author: isAdminMode ? "Admin" : currentUser.displayName || "Anonymous",
        authorId: isAdminMode ? "admin" : currentUser.uid,
        avatar: isAdminMode
          ? "https://github.com/shadcn.png"
          : currentUser.photoURL || "https://github.com/shadcn.png",
        title: isAdminMode ? adminTitle : "My PrepNepal Visa Experience",
        content: newExperience,
        timestamp: Timestamp.now(),
        visaType: selectedVisaType,
        status: selectedStatus,
        likes: 0,
        comments: 0,
        isAdminPost: isAdminMode,
        attempts: attempts,
        changesAfterRejection:
          selectedStatus === "Denied" ? changesAfterRejection : "",
      };

      await addDoc(experiencesRef, newExperienceObj);
      setNewExperience("");
      setAdminTitle("");
      setSelectedStatus("Pending");
      setSelectedVisaType("F1");
      setAttempts(0);
      setChangesAfterRejection("");
      fetchExperiences();
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // Delete experience (admin only)
  const handleDeleteExperience = async (id: string) => {
    if (!currentUser?.email?.endsWith("@admin.com")) return;
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      await deleteDoc(doc(db, "visa_experiences", id));
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  // Filtering by search term only
  let filteredExperiences = experiences.filter((exp) => {
    const search = searchTerm.toLowerCase();
    return (
      exp.title.toLowerCase().includes(search) ||
      exp.content.toLowerCase().includes(search) ||
      exp.author.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredExperiences.length / POSTS_PER_PAGE);
  const paginatedExperiences = filteredExperiences.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2">
          <span className="text-blue-700 font-semibold">Disclaimer:</span>
          <span className="text-sm text-blue-700">
            Experiences posted by admin are collected from sources like
            Facebook, Google, Instagram, Twitter, etc.
          </span>
        </div>

        {/* Only show AdSense when there is content */}
        {experiences.length > 0 && (
          <div className="flex justify-center mb-6">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-1446474252906589"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 md:mb-0">
              PrepNepal Visa Experiences
            </h1>
            {currentUser?.email?.endsWith("@admin.com") && (
              <Button
                variant={isAdminMode ? "default" : "outline"}
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="ml-2"
              >
                {isAdminMode ? "Switch to User Mode" : "Switch to Admin Mode"}
              </Button>
            )}
          </div>
          <Input
            type="text"
            placeholder="Search by keyword, university, country, author..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-48"
          />
        </div>

        <Card className="mb-8 shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>
              {isAdminMode
                ? "Post as Admin"
                : "Share Your PrepNepal Visa Experience"}
            </CardTitle>
            <CardDescription>
              {isAdminMode
                ? "Post an official visa experience"
                : "Help others by sharing your visa interview experience on PrepNepal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExperienceSubmit} className="space-y-4">
              {isAdminMode && (
                <Input
                  placeholder="Enter title for the experience"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  required
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={selectedVisaType}
                  onValueChange={setSelectedVisaType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Visa Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F1">F1 Student Visa</SelectItem>
                    <SelectItem value="F2">F2 Dependent Visa</SelectItem>
                    <SelectItem value="J1">J1 Exchange Visitor</SelectItem>
                    <SelectItem value="H1B">H1B Work Visa</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Denied">Denied</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Number of Attempts
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={attempts}
                    onChange={(e) => setAttempts(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                {selectedStatus === "Denied" && (
                  <div>
                    <label className="text-sm font-medium">
                      Changes Made After Rejection
                    </label>
                    <Textarea
                      placeholder="What changes have you made after rejection?"
                      value={changesAfterRejection}
                      onChange={(e) => setChangesAfterRejection(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              <Textarea
                placeholder="Share your visa interview experience..."
                value={newExperience}
                onChange={(e) => setNewExperience(e.target.value)}
                className="min-h-[150px]"
              />
              <Button type="submit">
                {isAdminMode ? "Post as Admin" : "Share Experience"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {paginatedExperiences.map((experience) => {
            // Shorten preview if too long
            const lines = experience.content.split(/\r?\n/);
            const isLong =
              experience.content.length > MAX_PREVIEW_LENGTH ||
              lines.length > MAX_PREVIEW_LINES;
            const isExpanded = expandedIds.includes(experience.id);
            let previewContent = experience.content;
            if (isLong && !isExpanded) {
              // Show first N lines or chars
              if (lines.length > MAX_PREVIEW_LINES) {
                previewContent =
                  lines.slice(0, MAX_PREVIEW_LINES).join("\n") + "...";
              } else {
                previewContent =
                  experience.content.slice(0, MAX_PREVIEW_LENGTH) + "...";
              }
            }
            return (
              <Card
                key={experience.id}
                className="shadow border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={experience.avatar} />
                      <AvatarFallback>{experience.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {experience.author}
                            {experience.isAdminPost && (
                              <Badge variant="secondary" className="ml-2">
                                Admin
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              experience.timestamp
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <Badge variant="outline">{experience.visaType}</Badge>
                          <Badge
                            className={
                              experience.status === "Approved"
                                ? "bg-green-500 text-white"
                                : experience.status === "Denied"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-200 text-gray-800"
                            }
                          >
                            {experience.status}
                          </Badge>
                          <Badge variant="outline">
                            Attempts: {experience.attempts}
                          </Badge>
                          {currentUser?.email?.endsWith("@admin.com") && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="ml-2"
                              onClick={() =>
                                handleDeleteExperience(experience.id)
                              }
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-medium mt-2">{experience.title}</h4>
                      <p
                        className="mt-2 whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                          __html: formatExperienceContent(previewContent),
                        }}
                      />
                      {isLong && (
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 mt-1"
                          onClick={() => toggleExpand(experience.id)}
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </Button>
                      )}
                      <div className="flex items-center space-x-4 mt-4">
                        <Button variant="ghost" size="sm">
                          Like ({experience.likes})
                        </Button>
                        <Button variant="ghost" size="sm">
                          Comment ({experience.comments})
                        </Button>
                      </div>
                      {experience.status === "Denied" &&
                        experience.changesAfterRejection && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                            <p className="text-sm font-medium text-yellow-800">
                              Changes Made After Rejection:
                            </p>
                            <p className="text-sm text-yellow-700">
                              {experience.changesAfterRejection}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaExperience;
