<?php 

    namespace Model;

    class Instrument extends \Model\Table 
    {
        protected static $table = "instruments";

        public static function get_instrument($offset, $limit, $filter = 'ALL', $post = []) 
        {   
            if ($filter === 'FAMILY') $where = "WHERE instru.`family_id` =:id";
            if ($filter === 'TYPE') $where = "WHERE instru.`type_id` =:id";
            if ($filter === 'ALL') $where = "WHERE instru.`id` IS NOT NULL";
            
            $sql = "SELECT
                    instru.`id`,
                    instru.`created`,
                    instru.`owner_id`,
                    instru.`name` `instrumentName`,
                    family.`name` `family`,
                    picture.`URI` `picture`,
                    type.`name` `type`,
                    brand.`name` `brand`
                    FROM `".self::$table."` instru
                    LEFT JOIN `instruments_family` family ON family.`id` = instru.`family_id`
                    LEFT JOIN `instruments_type` type ON type.`id` = instru.`type_id`
                    LEFT JOIN `instruments_brand` brand ON brand.`id` = instru.`brand_id`
                    LEFT JOIN `instruments_pictures` picture ON  picture.`instrument_id` = instru.`id` AND picture.`main_picture` = 1
                    ".$where."
                    ORDER BY instru.`created` DESC LIMIT ".$limit." OFFSET ".$offset."";

            return \My_class\App::get_DB()->prepare($sql, $post, null, false);
        }

        public static function get_brands_by_family_id($post)
        {
            $sql = "SELECT DISTINCT
                    instru_br.`name`,
                    instru_br.`id`
                    FROM `".self::$table."` instru
                    LEFT JOIN `instruments_brand` instru_br ON instru_br.`id` = instru.`brand_id`
                    WHERE instru.`family_id` =:id";

            return \My_class\App::get_DB()->prepare($sql, $post, null, false);
        }

        public static function get_brands_by_type_id($post)
        {   
            $sql = "SELECT DISTINCT
                    instru_br.`name`,
                    instru_br.`id`
                    FROM `".self::$table."` instru
                    LEFT JOIN `instruments_brand` instru_br ON instru_br.`id` = instru.`brand_id`
                    WHERE instru.`type_id` =:id";

            return \My_class\App::get_DB()->prepare($sql, $post, null, false);
        }

        public static function get_count_by($post, $data)
        {   
            if ($data === 'FAMILY') $where = "WHERE instru.`family_id` =:id";
            if ($data === 'TYPE') $where = "WHERE instru.`type_id` =:id";
            if ($data === 'BRAND') $where = "WHERE instru.`brand_id` =:brand_id AND instru.`type_id` =:type_id";
            if ($data === 'FAMILY_&_BRAND') $where = "WHERE instru.`family_id` =:family_id AND instru.`brand_id` =:brand_id";
            if ($data === 'ALL_BRAND') $where = "WHERE instru.`brand_id` =:brand_id";
            if ($data === 'OWNER') $where = "WHERE instru.`owner_id` =:id" ;

            $sql = "SELECT COUNT(*)
                    FROM `".self::$table."` instru
                    ".$where."";

            return \My_class\App::get_DB()->prepare($sql, $post, null, true);
        }

        public static function get_instrument_disponibility($post)
        {
            $sql = "SELECT
                    instru.`timeline_id_monday` mon,
                    instru.`timeline_id_tuesday` tue,
                    instru.`timeline_id_wednesday` wed,
                    instru.`timeline_id_thursday` thu,
                    instru.`timeline_id_friday` fri,
                    instru.`timeline_id_saturday` sat,
                    instru.`timeline_id_sunday` sun
                    FROM `".self::$table."` instru
                    WHERE instru.`id` =:id";

            return \My_class\App::get_DB()->prepare($sql, $post, null, false);
        }

        public static function get_admin_data($offset, $limit)
        {
            $sql = "SELECT
                    instru.`id`,
                    users.`name` `proprietaire`,
                    DATE(instru.`created`) `date de creation`,
                    type.`name` `nom`,
                    brand.`name` `marque`,
                    family.`name` `famille`
                    FROM `".self::$table."` instru
                    LEFT JOIN `instruments_family` family ON family.`id` = instru.`family_id`
                    LEFT JOIN `instruments_type` type ON type.`id` = instru.`type_id`
                    LEFT JOIN `instruments_brand` brand ON brand.`id` = instru.`brand_id`
                    LEFT JOIN `users` ON users.`id` = instru.`owner_id`
                    ORDER BY instru.`id` DESC LIMIT ".$limit." OFFSET ".$offset."";
            
            return \My_class\App::get_DB()->prepare($sql, [], null, false);
        }

        public static function get_owner_instrument($post, $offset, $limit)
        {   
            $sql = "SELECT
                    instru.`id` `n°`,
                    instru.`name` `nom`,
                    family.`name` `famille`,
                    brand.`name` `marque`,
                    DATE(instru.`created`) `ajoute le`
                    FROM `".self::$table."` instru
                    LEFT JOIN `instruments_family` family ON family.`id` = instru.`family_id`
                    LEFT JOIN `instruments_brand` brand ON brand.`id` = instru.`brand_id`
                    WHERE instru.`owner_id` =:id
                    ORDER BY instru.`id` DESC LIMIT ".$limit." OFFSET ".$offset."";
            
            return \My_class\App::get_DB()->prepare($sql, $post, null, false);   
        }

        public static function get_count_by_owner($post)
        {   
            return self::get_count_by($post, 'OWNER');
        }
        
    }

?>