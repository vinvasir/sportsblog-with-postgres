$(document).ready(() => {
	$('.delete-category').on('click', e => {
		$target = $(e.target);
		$.ajax({
			type: 'DELETE',
			url: '/categories/delete/' + $target.attr('data-cat-id'),
			success: res => {
				alert('Category removed');
				window.location.href='/manage/categories'
			},
			error: err => {
				console.log(err);
			}
		});
	});

	$('.delete-article').on('click', e => {
		$target = $(e.target);
		$.ajax({
			type: 'DELETE',
			url: '/articles/delete/' + $target.attr('data-art-id'),
			success: res => {
				alert('Article removed');
				window.location.href='/manage/articles'
			},
			error: err => {
				console.log(err);
			}
		});
	});	
});