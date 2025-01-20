"use client";

import { flashMessage } from "@thewebartisan7/next-flash-message";
import { useEffect, useRef, useState } from "react";

import CloseSvg from "@/svg/Close";
import SuccessSvg from "@/svg/success";

export default function Toast() {
	const [message, setMessage] = useState(null);
	const toastContainer = useRef(null);

	useEffect(() => {
		const showFlashMessage = async () => {
			const flash = await flashMessage();

			if (flash) {
				setMessage(flash.message);
				toastContainer.current.hidden = false;
				setTimeout(() => {
					setMessage(null);
					toastContainer.current.hidden = true;
				}, 3000);
			}
		};

		showFlashMessage();
		const interval = setInterval(showFlashMessage, 5000); // Poll for new messages every second

		return () => clearInterval(interval);
	}, []);
	return (
		<div
			className="w-full"
			ref={toastContainer}>
			<div
				id="toast-message"
				className={`${
					message ? "absolute -top-[70px] right-0" : "hidden"
				}  flex items-center justify-end w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800`}
				role="alert">
				<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
					<SuccessSvg />
					<span className="sr-only">Check icon</span>
				</div>
				<div className="ms-3 text-sm font-normal">
					<div>{message}</div>
				</div>
				<button
					type="button"
					className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-6 w-6 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
					data-dismiss-target="#toast-message"
					aria-label="Close"
					onClick={() => {
						setMessage(null); // Manually close the toast
						toastContainer.current.hidden = true;
					}}>
					<span className="sr-only">Close</span>
					<CloseSvg />
				</button>
			</div>
		</div>
	);
}
