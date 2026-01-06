"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Badge } from "@/components/ui/Badge";
import { useGetCandidatesSearchQuery } from "@/store/candidates/candidatesApi";

interface CandidateSearchFilterProps {
  onSearchChange?: (searchValue: string, statusValue: string) => void
}

const statusOptions = [
  { value: "To Be Scheduled", label: "To Be Scheduled", color: "bg-[#FFFBEB] hover:bg-[#FFFBEB] text-[#B45309]" },
  { value: "Scheduled", label: "Scheduled", color: "bg-[#F5F3FF] hover:bg-[#F5F3FF] text-[#7C3AED]" },
  { value: "Awaiting Feedback", label: "Awaiting Feedback", color: "bg-[#F1F5F9] hover:bg-[#F1F5F9] text-[#475569]" },
  { value: "Selected", label: "Selected", color: "bg-[#DCFCE7] hover:bg-[#DCFCE7] text-[#166534]" },
  { value: "Rejected", label: "Rejected", color: "bg-[#FFF1F2] hover:bg-[#FFF1F2] text-[#E11D48]" },
  { value: "Others", label: "Others", color: "bg-[#E0F2FE] hover:bg-[#E0F2FE] text-[#075985]" },
]

const CandidateSearchFilter: React.FC<CandidateSearchFilterProps> = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useGetCandidatesSearchQuery({
    candidateType: "internal",
    search: searchValue,
    status: selectedStatus,
  })

  useEffect(() => {
    onSearchChange?.(searchValue, selectedStatus)
  }, [searchValue, selectedStatus, onSearchChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleStatusChange = (value: string) => {
    if (selectedStatus === value) {
      setSelectedStatus("")
    } else {
      setSelectedStatus(value)
    }
  }

  const handleClearFilter = () => {
    setSelectedStatus("")
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-[303px] h-9 flex items-center gap-2 border border-zinc-200 rounded-lg p-[7.5px_3px] bg-white transition-all duration-200 ${searchValue ? "shadow-[0px_0px_0px_3px_#C4B5FD]" : "shadow"}`}
      >
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <Input
          value={searchValue}
          onChange={handleChange}
          placeholder="Search by candidate name"
          className="border-none shadow-none h-full text-sm text-[#71717A] focus-visible:ring-0"
        />
      </div>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-[88px] h-[37px] flex items-center justify-center gap-2 rounded-lg border ${selectedStatus ? "text-[#7C3AED] border-[#7C3AED]" : "border-zinc-300"}`}
          >
            <ListFilter className="w-4 h-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 p-[5px] gap-2 rounded-lg border border-[#E5E5E5] bg-white"
          align="end"
        >
          <div className="flex items-center justify-between px-3 py-[7.5px] min-h-9">
            <DropdownMenuLabel className="p-0 text-[14px] font-medium text-[#71717A] leading-[22px]">
              Filter by Status
            </DropdownMenuLabel>
            <button
              onClick={handleClearFilter}
              className="text-[12px] font-medium text-[#6D28D9] opacity-50 hover:opacity-100 transition-opacity rounded-lg px-2 py-1"
              disabled={!selectedStatus}
            >
              Clear all
            </button>
          </div>

          <DropdownMenuRadioGroup value={selectedStatus} onValueChange={handleStatusChange}>
            {statusOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="min-h-[32px] pl-8 pr-3 py-2 rounded-md gap-3 cursor-pointer hover:!bg-transparent focus:!bg-transparent data-[state=open]:!bg-transparent data-[highlighted]:!bg-transparent outline-none ring-0"
              >
                <Badge className={`${option.color} px-2 py-0.5 text-[12px] font-medium leading-[18px] rounded-sm h-[22px] flex items-center justify-center`}>
                  {option.label}
                </Badge>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CandidateSearchFilter;