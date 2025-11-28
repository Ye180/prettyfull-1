import { ArrowDownTray } from "@medusajs/icons";
import { RefObject } from "react";

type CategoryImageUploadProps = {
	fileInputRef: RefObject<HTMLInputElement>;
	isUploading: boolean;
	onFileSelect: (files: FileList | null) => void;
};

export const CategoryImageUpload = ({
	fileInputRef,
	isUploading,
	onFileSelect,
}: CategoryImageUploadProps) => {
	return (
		<div className="px-6 py-4 overflow-auto border-b bg-ui-bg-base lg:border-b-0 lg:border-l">
			<div className="flex flex-col space-y-2">
				<div className="flex flex-col gap-y-2">
					<div className="flex flex-col gap-y-1">
						<div className="flex items-center gap-x-1">
							<label className="font-sans font-medium txt-compact-small">
								Media
							</label>
							<p className="font-sans font-normal txt-compact-small text-ui-fg-muted">
								(Optional)
							</p>
						</div>
						<span className="txt-small text-ui-fg-subtle">
							Add media to the product to showcase it in your storefront.
						</span>
					</div>

					<div>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/svg+xml"
							onChange={(e) => onFileSelect(e.target.files)}
							hidden
						/>

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploading}
							className="flex flex-col items-center w-full p-8 border border-dashed rounded-lg outline-none bg-ui-bg-component border-ui-border-strong transition-fg group gap-y-2 hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus focus:border-solid disabled:opacity-50 disabled:cursor-not-allowed"
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDrop={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (!isUploading) {
									onFileSelect(e.dataTransfer.files);
								}
							}}
						>
							<div className="flex items-center text-ui-fg-subtle group-disabled:text-ui-fg-disabled gap-x-2">
								<ArrowDownTray />
								<p className="font-sans font-normal txt-medium">
									{isUploading ? "Uploading..." : "Upload images"}
								</p>
							</div>
							<p className="font-sans font-normal txt-compact-small text-ui-fg-muted group-disabled:text-ui-fg-disabled">
								Drag and drop images here or click to upload.
							</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
