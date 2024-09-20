<template src="./App.html"></template>

<script>
export default {
	data() {
		return {
			name: 'John Doe',
			title: 'Web Developer',
			introText:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam atque blanditiis corporis illum laborum libero magni placeat praesentium quis. Sapiente.',
			imageUrl: '/profile_pic.png',
			headlines: [
				'About Me',
				'Contact',
				'Skills',
				'Certifications',
				'Experience',
				'Education',
			],
			contact: {
				phone: '123-456-7890',
				email: 'jhon@gmail.com',
				address: '1234 Main St, City, State, Zip',
			},
			skills: ['Skill 1', 'Skill 2', 'Skill 3'],
			certifications: ['Certification 1', 'Certification 2', 'Certification 3'],
			experiences: [
				{
					title: 'Job Title',
					company: 'Company Name',
					location: 'Location',
					date: 'Start Date - End Date',
					responsibilities: [
						'Responsibility 1',
						'Responsibility 2',
						'Responsibility 3',
					],
				},
				{
					title: 'Job Title',
					company: 'Company Name',
					location: 'Location',
					date: 'Start Date - End Date',
					responsibilities: [
						'Responsibility 1',
						'Responsibility 2',
						'Responsibility 3',
					],
				},
			],
			educations: [
				{
					degree: 'Degree',
					institution: 'School Name',
					location: 'Location',
					duration: 'Start Date - End Date',
					description: ['Course 1', 'Course 2', 'Course 3'],
				},
			],
		};
	},
	methods: {
		updateHeadline(event, index) {
			this.headlines[index] = event.target.innerText;
		},
		updateProperty(event, key) {
			this[key] = event.target.innerText;
		},
		updateNestedProperty(event, key1, key2) {
			this[key1][key2] = event.target.innerText;
		},
		updateExperience(event, index, key) {
			this.experiences[index][key] = event.target.innerText;
		},
		updateResponsibility(event, index1, index2) {
			this.experiences[index1].responsibilities[index2] =
				event.target.innerText;
		},
		updateEducation(event, index, key) {
			this.educations[index][key] = event.target.innerText;
		},
		updateEducationDescription(event, index1, index2) {
			this.educations[index1].description[index2] = event.target.innerText;
		},
	},
};
</script>

<style scoped>
#resume {
	width: 210mm;
	height: 297mm;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
		rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.left-col {
	background-color: var(--background-color-left);
	color: var(--text-color-left);
	border-right: 1px solid var(--highlight-color-left);
	width: 30%;
	padding: 30px;
}

.right-col {
	background-color: var(--background-color-right);
	color: var(--text-color-right);
	width: 70%;
	padding: 30px;
}

.section-headline {
	font-size: 20px;
	font-weight: var(--headline-wight);
	margin-bottom: 15px;
	margin-top: 0;
}

.right-col .section-headline {
	color: var(--highlight-color-right);
}

.left-col .section-headline {
	border-bottom: 1px solid var(--highlight-color-left);
	padding-bottom: 5px;
	margin-right: -30px;
	padding-right: 10px;
	color: var(--highlight-color-left);
}

.resume-section {
	margin-bottom: 30px;
}

.personal-name {
	font-weight: 300;
	color: var(--highlight-color-right);
	font-size: 28px;
	border-bottom: 1px solid var(--highlight-color-right);
	margin: 0;
	margin-left: -30px;
	padding-left: 30px;
	padding-bottom: 15px;
}

.personal-title {
	border-bottom: 1px solid var(--highlight-color-right);
	margin: 0 0 20px -30px;
	padding: 15px 0 15px 30px;
	font-weight: 300;
	font-size: 20px;
}

#resume ul {
	padding-inline-start: 16px;
	margin-block-end: 0px;
	margin-block-start: 5px;
}

.profile-pic {
	display: block;
	width: 160px;
	height: 160px;
	border: 5px solid var(--highlight-color-left);
	margin-bottom: 20px;
	object-fit: cover;
	margin-left: auto;
	margin-right: auto;
	border-radius: 50%;
}

.inner-section {
	margin-bottom: 20px;
}
</style>
