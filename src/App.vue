<script setup>

</script>

<template>
  <div class="nav-bar">
  <h1>Health Records of Sesame street Residents</h1>
</div>
<div class="container">
  <div class="groups" v-for="group in bloodGroups" :key="group.group">
      <div class="cards">
          <h1 class="agegroup">Blood Group {{ group.group }}</h1>
          <ul>
              <li class="list" v-for="person in group.people" :key="person.name">
                  {{ person.name }} - {{ person.age }} 
              </li>
          </ul>
      </div>
  </div>
</div>
<!--------Bar Chart Container------->
<div class="chart-container" :class="{ hidden: !showChart }">
  <div id="bar-chart"></div>
</div>
<div :class="{ hidden: showChart }">
</div>

<div class="buttonContainer">
  <button @click="toggleChartVisibility">{{ showChart ? 'Hide Chart' : 'Show Chart' }}</button>
</div>
</template>

<script>
   export default {
  name: 'App',
  inject: ['bloodGroups'],
  data() {
        return {
            showChart: true,
        };
    },

  created() {
    console.log('Injected bloodGroups data:', this.bloodGroups);
    this.retrieveDataFromLocalStorage();
  },
 
  /*Save to local storage*/
  methods: {
        toggleChartVisibility() {
            this.showChart = !this.showChart;
        },
        saveDataToLocalStorage() {
    localStorage.setItem('bloodGroupsData', JSON.stringify(this.bloodGroups));
  },

  /*Retrieve from local storage */
  retrieveDataFromLocalStorage() {
    const savedData = localStorage.getItem('bloodGroupsData');
    if (savedData) {
      this.bloodGroups = JSON.parse(savedData);
    }
  },

    renderHighcharts() {
        const bloodGroupCategories = this.bloodGroups.map(group => group.group);
        const ageGroupCategories = ['11-20', '21-30', '31-40'];
        /******Filter people with same age group and blood group */
        const seriesData = [];
        ageGroupCategories.forEach(ageGroup => {
            const data = this.bloodGroups.map(group => {
                const peopleInAgeGroup = group.people.filter(person => {
                    const age = person.age;
                    if (ageGroup === '11-20') return age >= 11 && age <= 20; 
                    if (ageGroup === '21-30') return age >= 21 && age <= 30;
                    if (ageGroup === '31-40') return age >= 31 && age <= 40;
                });
                return peopleInAgeGroup.length;
            });
            seriesData.push({
                name: ageGroup,
                data: data
            });
        });

        Highcharts.chart('bar-chart', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Blood Group and Age Group Distribution'
            },
            xAxis: {
                categories: bloodGroupCategories
            },
            yAxis: {
                title: {
                    text: 'Number of People'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: seriesData
        });
    },
    },
    watch: {
  bloodGroups: {
    handler() {
      this.saveDataToLocalStorage();
    },
    deep: true, // Watch for nested changes
  },
},

    mounted() {
      this.renderHighcharts();
    },
};


      
    
</script>
