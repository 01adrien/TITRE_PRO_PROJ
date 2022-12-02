<?php 

    namespace Controller;

    class Reservation extends \Controller\Controller
    {
        public static function get_instrument_disponibility($post)
        {   
            $attr['id'] = self::formatdata($post, 'id', \Model\Table::P_INT);
            $timeline_id_by_day = \Model\Instrument::get_instrument_disponibility($attr);
            $data = [];
            $final_data = [];
            foreach($timeline_id_by_day[0] as $day => $val)
            {
                if (!$val) '';
                else 
                {
                    $id['id'] = self::formatdata(['id' => $val], 'id', \Model\Table::P_INT);
                    $timeLine = \Model\Timeline_day::get_by_ID($id);
                    unset($timeLine->id);
                    unset($timeLine->total_hours);
                    foreach($timeLine as $k => $v)
                    {   
                        if ((int)$v > 0){
                            $data[$day][$v][] = $k ;
                        }
                    }
                }                
                if (\is_string($day)) 
                {   
                    foreach ($data[$day] as $key => $value)
                    {   
                        
                        if (count($value) === 2) 
                        {
                            if (!isset($final_data[$day])) {
                                $final_data[$day] = $value[0].'h-'.$value[1] . "h | ";
                            } else {
                                $final_data[$day] .= $value[0].'h-'.$value[1] . "h | ";
                            }
                        } 
                        if (count($value) > 2)
                        {   
                            if (!isset($final_data[$day])) {
                                $final_data[$day] = $value[0] .'h-'.$value[count($value)-1] . "h | ";
                            } else {
                                $final_data[$day] .= $value[0].'h-'.$value[count($value)-1] . "h | ";
                            }
                        }
                    }
                }
            }
            return $final_data;
        }

        public static function get_reservation_for_one_by_month($post)
        {
            $attr['id'] = self::formatdata($post, 'id', \Model\Table::P_INT);
            $attr['month'] = self::formatdata($post, 'month', \Model\Table::P_INT);
            $attr['year'] = self::formatdata($post, 'year', \Model\Table::P_INT);
            $all_resa = (array)\Model\Reservation::get_reservation_for_one_instrument($attr, 'MONTH');
            $reservations = [];
            foreach ($all_resa as $resa)    
            {   
                $resa = (array)$resa;
                $attr = [];
                $attr['id'] = self::formatdata($resa, $resa['day'], \Model\Table::P_INT );
                $timeline = \Model\Timeline_day::get_by_ID($attr);
                foreach ($timeline as $h) if ($timeline->$h === null) unset($timeline->$h);
                $total_slots = $timeline->total_hours;
                $array = [];
                $array['day'] = $resa['date'];
                $array['id'] = $post['id'];
                $dispo = self::get_dispo_slots_by_day($array);
                $dispo_slots = $total_slots - $dispo['count'] > 0;
                $reservations[$resa['id']] = ['date' => $resa['date'], 'start' => $resa['start'], 'end' => $resa['end'], 'dispo_slots' => $dispo_slots];
            }
            return $reservations;
        }

        public function get_dispo_slots_by_day($post) {          
            $date = date_create($post['day']);
            $attr['id'] = self::formatdata($post, 'id', \Model\Table::P_INT);
            $attr['day'] = self::formatdata($post, 'day', \Model\Table::P_STRING);
            $day_resas =  \Model\Reservation::get_reservation_for_one_instrument($attr, 'DAY');
            $no_dispo_txt = "";
            $no_dispo_count = 0;
            foreach ($day_resas as $resa)
            {
                $resa = (array)$resa;
                $no_dispo_count += (int)$resa['reservation_slot'];
                $no_dispo_txt .= $resa['start']."h-".$resa['end']."h". " et ";
            }
            return ['txt' => \substr($no_dispo_txt, 0, -3), 'count' => $no_dispo_count];
            
        }
    }
?>