   /**
     * 渐进式法定退休年龄计算方法
     *
     * @param begin_date 计算初始时间
     * @param old_retire_year 旧的退休年龄
     * @param new_retire_year 最终退休年龄
     * @param step 每step个月延迟退休一个月
     * @param input_date 输入时间 支持:YYYY-M, YYYY-MM, YYYY-M-D 或 YYYY-MM-DD 格式
     */
    function calc_new_retire(begin_date, old_retire_year, new_retire_year, step, input_date) {
      //1.日期格式验证
      // 日期正则表达式：匹配 YYYY-M, YYYY-MM, YYYY-M-D 或 YYYY-MM-DD 格式
      var valid_date = /^\d{4}-\d{1,2}(-\d{1,2})?$/;
      if (!valid_date.test(begin_date)) {
          console.error('invalid date : ' + begin_date)
          return false;
      }
      if (!valid_date.test(input_date)) {
          console.error('invalid date : ' + input_date)
          return false;
      }

      var [begin_date_year, begin_date_month] = begin_date.split('-').map(v => parseInt(v));
      var [input_date_year, input_date_month] = input_date.split('-').map(v => parseInt(v));

      //2. 在初始日期之前，按原定的退休年龄进行退休
      if ((input_date_year < begin_date_year) || (input_date_year === begin_date_year && input_date_month < begin_date_month)) {
          return {
              input_date: input_date,
              new_retire_year: old_retire_year,
              new_retire_month: 0,
              new_retire_date: (input_date_year + old_retire_year) + '-' + input_date_month,
              total_delay_month: 0
          }
      }

      var delay_year = new_retire_year - old_retire_year;
      var cost_year = delay_year * step;
      var end_date_year = begin_date_year + cost_year;
      var end_date_month = begin_date_month;

      //3. 在结束日期之后，按新的退休年龄进行退休
      if (input_date_year > end_date_year || (input_date_year === end_date_year && input_date_month >= end_date_month)) {
          return {
              input_date: input_date,
              new_retire_year: new_retire_year,
              new_retire_month: 0,
              new_retire_date: (input_date_year + new_retire_year) + '-' + input_date_month,
              total_delay_month: delay_year * 12
          }
      }

      //4. 在开始和结束日期之中，则计算延迟退休时间
      var months_diff = (input_date_year - begin_date_year) * 12 + (input_date_month - (begin_date_month - 1))
      var total_delay_month = Math.ceil(months_diff / step); // 延迟总月份数

      var add_month = input_date_month + (total_delay_month % 12);
      var new_date_month, new_date_year;
      if (add_month > 12) {
          new_date_month = add_month % 12;
          new_date_year = input_date_year + Math.floor(total_delay_month / 12) + 1;
      } else {
          new_date_month = add_month;
          new_date_year = input_date_year + Math.floor(total_delay_month / 12)
      }

      return {
          input_date: input_date,
          new_retire_year: old_retire_year + Math.floor(total_delay_month / 12),
          new_retire_month: total_delay_month % 12,
          new_retire_date: (new_date_year + old_retire_year) + '-' + new_date_month,
          total_delay_month: total_delay_month
      }
  }
