export default function NotAuthorized() {
	return (
		<div className="relative mx-auto min-h-[calc(100vh-75px)] max-w-screen-xl p-4 flex justify-center items-center">
			<p className="text-center text-2xl text-gray-400 font-light">
				❌ 403 Forbidden: You are not authorized to access this page.
			</p>
		</div>
	);
}
