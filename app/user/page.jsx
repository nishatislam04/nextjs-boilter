import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import UserTable from "../../components/Table";
import Spinner from "@/components/Spinner";
import prisma from "@/prisma/db";
import Toast from "@/components/Toast";
import TableHeaderAction from "@/components/TableHeaderAction";
import Table from "../../components/Table";
import Link from "next/link";
import Button from "@/components/Button";
import GoBack from "@/components/GoBack";
import { deleteUser } from "@/actions/users/delete";
import { Anchor, ScrollArea } from "@mantine/core";
import redis from "@/prisma/redis";

async function fetchUsers(currentPage, itemPerPage, query, orderBy) {
  return await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
      ],
    },
    orderBy,
    skip: (currentPage - 1) * itemPerPage,
    take: itemPerPage,
  });
  // const [users, totalUsers] = await prisma.$transaction([
  //   prisma.user.findMany({
  //     where: {
  //       OR: [
  //         {
  //           name: {
  //             contains: query,
  //           },
  //         },
  //         {
  //           email: {
  //             contains: query,
  //           },
  //         },
  //       ],
  //     },
  //     orderBy,
  //     skip: (currentPage - 1) * itemPerPage,
  //     take: itemPerPage,
  //   }),
  //   prisma.user.count(),
  // ]);
  // return [users, totalUsers];
}

export default async function UserPage({ searchParams }) {
  const usersCache = "users_Listings";
  const itemPerPage = 5;
  const params = await searchParams;
  const searchQuery = params?.query || "";
  const currentPage = params?.page || 1;
  const nameSort = params?.nameSorting || null;
  const emailSort = params?.emailSorting || null;

  // Set sorting logic
  const orderBy = emailSort
    ? { email: emailSort } // Prioritize sorting by email if emailSort exists
    : { name: nameSort || "desc" }; // Default to sorting by name in "desc" order if no emailSort

  let userListings = await redis.get(usersCache);
  let totalUsers = await prisma.user.count();
  console.log(userListings);
  if (!userListings) {
    userListings = await fetchUsers(
      currentPage,
      itemPerPage,
      searchQuery,
      orderBy,
    );
    await redis.set(usersCache, JSON.stringify(userListings), "EX", 86400);
  } else {
    userListings = JSON.parse(userListings);
  }

  const totalPages = Math.ceil(totalUsers / itemPerPage);
  const tableHeader = [
    { label: "Name", willSort: true },
    { label: "email", willSort: true },
    { label: "profile", willSort: false },
    { label: "Posts", willSort: false },
    { label: "Actions", willSort: false },
  ];
  const tableDataId = ["name", "email", "profile", "posts"];

  return (
    <div className="max-w-(--breakpoint-xl) relative mx-auto mt-12 p-4">
      <Toast />

      <TableHeaderAction
        queryValue={searchQuery}
        // queryValue="test"
        tableName="User"
      />

      <Suspense fallback={<Spinner />}>
        <Table
          name="user"
          datas={userListings}
          tableHeader={tableHeader}
          tableDataId={tableDataId}
          deleteAction={deleteUser}
          currentPage={currentPage}
          searchQuery={searchQuery}
          renderCell={(data, field) => {
            if (field === "profile") {
              return (
                <Anchor
                  component={Link}
                  href={`/user/${data.id}`}
                  underline="hover"
                >
                  profile
                </Anchor>
              );
            }
            if (field === "posts") {
              return (
                <Anchor
                  component={Link}
                  href={`post/${data.id}`}
                  underline="hover"
                >
                  Posts
                </Anchor>
              );
            }
            // Default rendering for other fields
            return data[field] || "N/A";
          }}
        />
      </Suspense>

      <Pagination
        uri="user"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
