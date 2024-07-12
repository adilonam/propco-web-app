
"use client"
 
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ClaimRequest, User } from '@prisma/client';

import React from 'react';
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useParams } from 'next/navigation'

interface ClaimRequestData extends ClaimRequest  {
user: User ,
}
   


   
  export default function ClaimRequestPage() {

    const { toast } = useToast()
    const params = useParams<{ id: string }>()
    const [user, setUser] = React.useState<User | null>(null);

    const id: BigInt = BigInt(params?.id as string || "0")

    const [claimRequests, setClaimRequests] = React.useState<ClaimRequestData[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})


    function updateApproveStatus(claimRequests: ClaimRequestData[], id: string, newApproveStatus: boolean): ClaimRequestData[] {
      return claimRequests.map(request => 
        request.id === id ? { ...request, approve: newApproveStatus } : request
      );
    }
    
    const handleApproveClick = async (claimRequestId : string) => {
      try {
        const response = await axios.put(`/api/claim-request/${claimRequestId}`, {
          approve: true,
        } ,{params: {userId: user?.id}});
        let _data = updateApproveStatus(claimRequests , claimRequestId , true); 
        setClaimRequests([..._data])
        toast({
          description: "Approved successfully",
      })
        console.log('Claim request approved:', response.data);
      } catch (error) {
        console.error('Failed to approve claim request:', error);
      }
    };
    
      
       
       const columns: ColumnDef<ClaimRequestData>[] = [
        {
          accessorKey: "userId",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                user Id
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("userId")}</div>,
        },
        
        {
          accessorKey: "email",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
          accessorKey: "cryptoAddress",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Crypto Address
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("cryptoAddress")}</div>,
        },
     
        {
          accessorKey: "phone",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Phone
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
        },
        {
          accessorKey: "balance",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Balance
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const user = row.original.user as User; // Explicitly type the user object
            return <div className="lowercase">{user.balance}</div>;
          },
        },
        {
          accessorKey: "date",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Date
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("date")}</div>,
        },
        {
          accessorKey: "approve",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Approve
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {
            const approveText = row.getValue("approve") ? "Yes" : "No"; // Explicitly type the user object
            return <div className="lowercase">{approveText}</div>;
          },
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
    
     
    
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={()=>{handleApproveClick(row.original.id)}}
                  >
                  Aprrove
                  </DropdownMenuItem>
                  
                </DropdownMenuContent>
              </DropdownMenu>
            )
          },
        },
      ]
    
    
    


















    
   


   




    const table = useReactTable({
      data:claimRequests,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })



    React.useEffect(() => {
        if (id) {
            axios.get(`/api/user/${id}`)
                .then((response) => {
                    setUser(response.data);

                })
                .catch((error) => {
                    console.error('Error fetching user data:', error.response?.data?.error || 'User not found');
                    setUser(null);
                });
        }
    }, [id]);




    React.useEffect(() => {
      const fetchClaimRequests = async () => {
        try {
          const response = await axios.get<ClaimRequestData[]>('/api/claim-request' , {params:{userId:user?.id }});
          setClaimRequests(response.data);
          console.log(response.data);
          
        } catch (error) {
          console.error('Error fetching claim requests:', error);
        }
      };
  if(user){
    fetchClaimRequests();
  }
  
    }, [user]);
   
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="w-60"
          />
        
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }