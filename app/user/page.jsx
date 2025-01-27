import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import TableHeaderAction from "@/components/TableHeaderAction";
import { fetchAll, fetchTotalCount } from "@/lib/repository/user/dal";
import { CURRENT_PAGE, PER_PAGE } from "@/lib/config/settings";
import { sortData } from "@/lib/helpers";
import UserListingsTable from "./Table";

export default async function UserPage({ searchParams }) {
	const params = await searchParams;
	const searchQuery = params?.query || "";
	const currentPage = params?.page || CURRENT_PAGE;
	const nameSort = { name: params?.nameSorting || null };
	const emailSort = { email: params?.emailSorting || null };
	const orderBy = sortData([nameSort, emailSort], { name: "asc" });

	let users = null;
	users = await fetchAll(currentPage, searchQuery, orderBy);
	let totalUsers = await fetchTotalCount();
	const totalPages = Math.ceil(totalUsers / PER_PAGE);

	return (
		<div className="relative mx-auto mt-12 max-w-screen-xl p-4">
			<Toast />

			<TableHeaderAction
				queryValue={searchQuery}
				tableName="User"
			/>

			<Suspense fallback={<Spinner />}>
				<div className="min-h-[22rem]">
					<UserListingsTable users={users} />
				</div>
			</Suspense>

			<Pagination
				uri="user"
				totalPages={totalPages}
				currentPage={currentPage}
			/>
		</div>
	);
}
