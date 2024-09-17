<template>
  <main class="container">
    <div id="resume" class="d-flex">
      <div class="left-col">
        <div class="resume-section">
          <h4 class="section-headline">
            About Me
          </h4>
          <div>
            {{ introText}}
          </div>
        </div>

        <div class="resume-section">
          <h4 class="section-headline">
            Contact
          </h4>
          <ul>
            <li>{{ contact.phone }}</li>
            <li>{{ contact.email }}</li>
            <li>{{ contact.address }}</li>
          </ul>
        </div>

        <div class="resume-section">
          <h4 class="section-headline">
            Skills
          </h4>
          <ul>
            <li>Skill 1</li>
            <li>Skill 2</li>
            <li>Skill 3</li>
          </ul>
        </div>

        <div class="resume-section">
          <h4 class="section-headline">
            Languages
          </h4>
          <ul>
            <li>Language 1</li>
            <li>Language 2</li>
            <li>Language 3</li>
          </ul>
        </div>
      </div>

      <div class="right-col">
        <h4 class="personal-name">
          {{ name }}
        </h4>
        <h4 class="personal-title">
          Job Title
        </h4>

        <div class="resume-section">
          <h4 class="section-headline">
            Experience
          </h4>
          <div>
            <div>Job Title</div>
            <div>Company Name</div>
            <p>Start Date - End Date</p>
            <ul>
              <li>Responsibility 1</li>
              <li>Responsibility 2</li>
              <li>Responsibility 3</li>
            </ul>
          </div>
        </div>

        <div class="resumes-section">
          <h4 class="section-headline">
            Education
          </h4>
          <div>
            <div>Degree</div>
            <div>School Name</div>
            <p>Start Date - End Date</p>
            <ul>
              <li>Course 1</li>
              <li>Course 2</li>
              <li>Course 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      name: 'John Doe',
      title: 'Web Developer',
      introText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam atque blanditiis corporis illum laborum libero magni placeat praesentium quis. Sapiente.',
      contact: {
        phone: '123-456-7890',
        email: 'jhon@gmail.com',
        address: '1234 Main St, City, State, Zip',
      },
      skills: ['Skill 1', 'Skill 2', 'Skill 3'],
      languages: ['Language 1', 'Language 2', 'Language 3'],
      experience: [
        {
          title: 'Job Title',
          company: 'Company Name',
          date: 'Start Date - End Date',
          responsibilities: ['Responsibility 1', 'Responsibility 2', 'Responsibility 3'],
        },
      ],
      education: [
        {
          degree: 'Degree',
          school: 'School Name',
          date: 'Start Date - End Date',
          courses: ['Course 1', 'Course 2', 'Course 3'],
        },
      ],
    };
  },
}
</script>

<style scoped>
#resume {
  width: 210mm;
  height: 297mm;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
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
</style>
<script setup lang="ts">
</script>