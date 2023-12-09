import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Input from '../Input';
import RTE from '../RTE';
import Select from '../Select';
import appwriteService from '../../appwrite/config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function PostForm({ post }) {
	const { register, handleSubmit, watch, setValue, getValues, control } =
		useForm({
			defaultValues: {
				title: post?.title || '',
				slug: post?.slug || '',
				content: post?.content || '',
				status: post?.status || 'active'
			}
		});

	const navigate = useNavigate();
	const userData = useSelector(state => state.auth.userData);

	const submit = async data => {
		if (post) {
			const file = data.image[0]
				? await appwriteService.uploadFile(data.image[0])
				: null;

			if (file) {
				await appwriteService.deleteFile(post.featuredImage);
			}

			const dbPost = await appwriteService.updatePost(post.$id, {
				...data,
				featuredImage: file ? file.$id : undefined
			});

			if (dbPost) {
				navigate(`/post/${dbPost.$id}`);
			}
		} else {
			const file = await appwriteService.uploadFile(data.image[0]);
			if (file) {
				const fileId = file.$id;
				data.featuredImage = fileId;
				const dbPost = await appwriteService.createPost({
					...data,
					userId: userData.$id
				});

				if (dbPost) {
					navigate(`/post/${dbPost.$id}`);
				}
			}
		}
	};

	const slugTransform = useCallback(value => {
		if (value && typeof value === 'string') {
			return value
				.trim()
				.toLowerCase()
				.replace(/[^a-zA-Z\d\s]+/g, '-')
				.replace(/\s/g, '-');
		}
	}, []);

	useEffect(() => {
		watch((value, { name }) => {
			if (name === 'title') {
				setValue('slug', slugTransform(value.title), { shouldValidate: true });
			}
		});
	}, [watch, slugTransform, setValue]);

	return (
		<form className="flex flex-wrap" onSubmit={handleSubmit(submit)}>
			<div className="w-2/3 px-2">
				<Input
					label="Title"
					placeholder="Title"
					className="mb-4"
					{...register('title', { required: true })}
				/>
				<Input
					label="Slug :"
					placeholder="Slug"
					className="mb-4"
					{...register('slug', { required: true })}
					onInput={e => {
						setValue('slug', slugTransform(e.currentTarget.value), {
							shouldValidate: true
						});
					}}
				/>
				<RTE
					label="Content :"
					name="content"
					control={control}
					defaultValue={getValues('content')}
				/>
			</div>

			<div className="w-1/3 px-2">
				<Input
					className="mb-4"
					label="Featured Image"
					type="file"
					accept="iamge/png, image/jpg, image/jpeg"
					{...register('image', { required: !post })}
				/>

				{post && (
					<div className="w-full mb-4">
						<img
							className="rounded-lg"
							src={appwriteService.getFilePreview(post.featuredImage)}
							alt={post.title}
						/>
					</div>
				)}

				<Select
					className="mb-4"
					lable="Status"
					options={['active', 'inactive']}
					{...register('status', { required: true })}
				/>

				<Button
					className="w-full"
					bgColor={post ? 'bg-green-500' : undefined}
					type="submit"
				>
					{post ? 'Update' : 'Submit'}
				</Button>
			</div>
		</form>
	);
}
