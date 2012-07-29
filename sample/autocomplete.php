<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Autocomplete extends CI_Controller {
 
    public function __construct()
	{
		parent::__construct();
        $this->load->model('MAutocomplete');
    }
 
    function index(){
        $this->load->view('autocomplete/show');
    }
 
    function lookup(){
        // process posted form data (the requested items like province)
        $keyword = $this->input->post('term');
        $data['response'] = 'false'; //Set default response
        $query = $this->MAutocomplete->lookup($keyword); //Search DB
        if( ! empty($query) )
        {
            $data['response'] = 'true'; //Set response
            $data['message'] = array(); //Create array
            foreach( $query as $row )
            {
                $data['message'][] = array(
                                        'id'=>$row->idmapel,
                                        'value' => $row->mapel,
                                        ''
                                     );  //Add a row to array
            }
        }
        if('IS_AJAX')
        {
            echo json_encode($data); //echo json string if ajax request
 
        }
        else
        {
            $this->load->view('autocomplete/index',$data); //Load html view of search results
        }
    }
	
	
	function carinipnama(){
        $keyword = $this->input->post('term');
        $data['response'] = 'false'; //Set default response
        $query = $this->MAutocomplete->carinipnama($keyword); //Search DB
        if( ! empty($query) )
        {
            $data['response'] 	= 'true'; //Set response
			$data['totrows']	= $query['totrows'];
			$data['start']		= $query['start'];
			$data['totpage']	= $query['totpage'];
			$data['curpage']	= $query['curpage'];
            $data['message'] 	= array(); //Create array
			
            foreach( $query['data'] as $row )
            {
                $data['message'][] = array(
                                        'nip'=>$row->B_02B,
                                        'nm' => $row->B_03,
                                        ''
                                     );  
				//Add a row to array
            }
        }
        if('IS_AJAX')
        {
            echo json_encode($data); //echo json string if ajax request
 
        }
        else
        {
            $this->load->view('autocomplete/index',$data); //Load html view of search results
        }
    }
	
	function carinip(){
		$keyword 	= $this->input->post('keyword');
		
		$per_page 	= intval($this->input->post('per_page'));
		$start		= (intval($this->input->post('page'))-1)*$per_page;
		$page		= intval($this->input->post('page'));
		$rs = $this->db->query("select nip,nama from tb_01 where (nip like '%".$keyword."%' or nama like '%".$keyword."%')");
		$arr['result'] 		= $rs->num_rows();
		$arr['per_page'] 	= $per_page;
		$arr['page'] 		= (($page>0)?$page:1);
		$rs = $this->db->query("select nip,nama from tb_01 where (nip like '%".$keyword."%' or nama like '%".$keyword."%') limit ".$page.",".$per_page."");
		$arr['rows'] = $rs->result();
		echo json_encode($arr);
		
		//echo '{"result":5,"rows":[{"nip":"0686.11.2007.339","nama":"NGURAH PANDJI MERTHA AGUNG DURYA, SE, M.Si","staf_id":"133"},{"nip":"0686.12.1997.112","nama":"AGUNG WARDOYO, S.Kom","staf_id":"190"},{"nip":"0686.12.2001.257","nama":"AGUNG NUGROHO, S.Kom","staf_id":"250"},{"nip":"0686.20.2009.370","nama":"AGUNG SEDAYU, SE, MM","staf_id":"297"},{"nip":"0686.88.0000.011","nama":"AGUNG BUDI SULISTYO, S.Pd.","staf_id":"390"}]}';
	}
	
}